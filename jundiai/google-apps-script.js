// Copy this entire file into Google Apps Script, without a myFunction wrapper.
// Planilha de Jundiaí já configurada. Use um projeto de Apps Script próprio para esta cidade.
const COLUNAS = [
  "Data", "Nome completo", "Idade", "Telefone informado", "Telefone para duplicidade",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "Página de entrada", "Origem de referência", "ID do evento Lead"
];
const LOCALIZACAO_COLUNAS = ["Cidade estimada (IP)", "Estado estimado (IP)", "País estimado (IP)", "Fonte da localização"];

function resposta(dados) {
  return ContentService.createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
}

function numeroLocal(valor) {
  if (typeof valor !== "string" || valor.length > 30 || !/^\+?[\d\s().-]+$/.test(valor.trim())) {
    throw new Error("Informe um telefone válido, com ou sem DDD.");
  }
  let numero = valor.replace(/\D/g, "");
  if ([12, 13].includes(numero.length) && numero.startsWith("55")) numero = numero.slice(2);
  if ([10, 11].includes(numero.length)) numero = numero.slice(2);
  if (!/^\d{8,9}$/.test(numero)) throw new Error("Informe um telefone válido, com ou sem DDD.");
  return numero;
}

function abaDestino() {
  const id = "1i-bQQo3lU5CAbpS3iSvRcCNISxsfwYE4qzLrzkSsjnk";
  const arquivo = SpreadsheetApp.openById(id);
  const abaId = "0";
  const abas = arquivo.getSheets();
  const aba = abaId ? abas.find((item) => String(item.getSheetId()) === abaId) : abas[0];
  if (!aba) throw new Error("A aba de destino não foi encontrada.");
  return aba;
}

function prepararAba(aba) {
  if (aba.getMaxColumns() < COLUNAS.length) {
    aba.insertColumnsAfter(aba.getMaxColumns(), COLUNAS.length - aba.getMaxColumns());
  }
  if (aba.getLastRow() === 0) {
    aba.getRange(1, 1, 1, COLUNAS.length).setValues([COLUNAS]);
    aba.setFrozenRows(1);
  }
  const largura = Math.max(COLUNAS.length, aba.getLastColumn());
  const atuais = aba.getRange(1, 1, 1, largura).getDisplayValues()[0];
  if (COLUNAS.some((valor, indice) => valor !== atuais[indice])) {
    throw new Error("A estrutura das primeiras colunas foi alterada. Confira os cabeçalhos originais; nenhum dado foi substituído.");
  }
  // Append only missing location columns; preserve all user-added columns/data.
  const faltantes = LOCALIZACAO_COLUNAS.filter((nome) => !atuais.includes(nome));
  if (faltantes.length) {
    const total = largura + faltantes.length;
    if (aba.getMaxColumns() < total) aba.insertColumnsAfter(aba.getMaxColumns(), total - aba.getMaxColumns());
    aba.getRange(1, largura + 1, 1, faltantes.length).setValues([faltantes]);
    atuais.push(...faltantes);
  }
  return atuais;
}

function prepararPlanilha() {
  const trava = LockService.getScriptLock();
  trava.waitLock(30000);
  try { prepararAba(abaDestino()); }
  finally { trava.releaseLock(); }
}

function textoSeguro(valor, limite = 256) {
  const texto = String(valor ?? "").trim().slice(0, limite);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function doPost(e) {
  const trava = LockService.getScriptLock();
  let bloqueado = false;
  try {
    let dados;
    try { dados = JSON.parse(e.postData.contents); }
    catch { return resposta({ ok: false, codigo: "DADOS_INVALIDOS", mensagem: "Dados inválidos." }); }
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return resposta({ ok: false, codigo: "DADOS_INVALIDOS", mensagem: "Dados inválidos." });
    }
    const nome = String(dados.nome || "").trim().replace(/\s+/g, " ");
    const idade = String(dados.idade ?? "").trim();
    if (nome.length < 3 || nome.length > 150 || nome.split(" ").length < 2) {
      return resposta({ ok: false, codigo: "DADOS_INVALIDOS", mensagem: "Informe seu nome completo." });
    }
    if (idade !== "" && (!/^\d{1,3}$/.test(idade) || Number(idade) < 1 || Number(idade) > 120)) {
      return resposta({ ok: false, codigo: "DADOS_INVALIDOS", mensagem: "Informe uma idade válida." });
    }
    let chave;
    try { chave = numeroLocal(dados.telefone); }
    catch (erro) { return resposta({ ok: false, codigo: "DADOS_INVALIDOS", mensagem: erro.message }); }
    trava.waitLock(30000);
    bloqueado = true;
    const aba = abaDestino();
    const cabecalhos = prepararAba(aba);
    const ultimaLinha = aba.getLastRow();
    if (ultimaLinha > 1 && aba.getRange(2, 5, ultimaLinha - 1, 1).getDisplayValues().flat().includes(chave)) {
      return resposta({ ok: false, codigo: "DUPLICADO", mensagem: "Este telefone já está cadastrado." });
    }
    const idEvento = /^[A-Za-z0-9-]{1,100}$/.test(String(dados.event_id || ""))
      ? String(dados.event_id) : Utilities.getUuid();
    const linha = ultimaLinha + 1;
    if (linha > aba.getMaxRows()) aba.insertRowsAfter(aba.getMaxRows(), 1);
    const valores = [
      new Date(), textoSeguro(nome, 150), idade === "" ? "" : Number(idade), textoSeguro(dados.telefone, 30), chave,
      ...["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"].map((key) => textoSeguro(dados[key])),
      textoSeguro(dados.landing_page, 1000), textoSeguro(dados.referrer, 500), idEvento
    ];
    valores.length = cabecalhos.length;
    valores.fill("", COLUNAS.length);
    const localizacao = [dados.estimated_city, dados.estimated_state, dados.estimated_country, dados.location_source];
    LOCALIZACAO_COLUNAS.forEach((nome, indice) => {
      valores[cabecalhos.indexOf(nome)] = textoSeguro(localizacao[indice], 120);
    });
    aba.getRange(linha, 4, 1, cabecalhos.length - 3).setNumberFormat("@");
    aba.getRange(linha, 1, 1, cabecalhos.length).setValues([valores]);
    SpreadsheetApp.flush();
    return resposta({ ok: true, codigo: "CADASTRADO", event_id: idEvento, mensagem: "Cadastro realizado com sucesso." });
  } catch (erro) {
    console.error("Falha na integração: " + erro.message);
    return resposta({ ok: false, codigo: "ERRO", mensagem: "Não foi possível concluir. Tente novamente." });
  } finally {
    if (bloqueado) trava.releaseLock();
  }
}

// Public capabilities: no sheet data or credentials are exposed.
function doGet() {
  return resposta({ ok: true, capabilities: { age_optional: true, estimated_location: true } });
}
