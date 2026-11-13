import {register} from './questionario-backend.mjs';
export default async request=>register(request,process.env.SITES_BACKEND_TOKEN);
export const config={path:'/api/inscricao'};
