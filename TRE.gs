/**
 * TRE — endpoints iniciais da camada integrada.
 * Regra preservada: Supervisor/Supervisor Técnico decide; Coordenador assina em etapa posterior.
 */
function apiTreQueue(token){
  const s=session_(token); requireModule_(s.user,'TRE','VISUALIZAR');
  const scope=scopeIds_(s.user,'TRE');
  return rows_(moduleDb_('TRE'),'SOLICITACOES').filter(r=>scope.all||scope.ids.has(String(r.ID_USUARIO))||String(r.ID_USUARIO)===String(s.user.ID_USUARIO));
}
function apiTreDecide(token,requestId,decision,observation){
  const s=session_(token),u=s.user;
  if(!['APROVAR','REPROVAR','DEVOLVER'].includes(decision))throw new Error('Decisão inválida.');
  requireModule_(u,'TRE','APROVAR');
  const sh=moduleDb_('TRE'),req=rows_(sh,'SOLICITACOES').find(x=>String(x.ID_SOLICITACAO)===String(requestId));
  if(!req)throw new Error('Solicitação não encontrada.');
  assertScope_(u,'TRE',req.ID_USUARIO);
  if(!['SUBMETIDA','EM_ANALISE','DEVOLVIDA'].includes(String(req.STATUS)))throw new Error('Solicitação não está disponível para decisão.');
  const status=decision==='APROVAR'?'AGUARDANDO_ASSINATURA_COORDENADOR':decision==='REPROVAR'?'REPROVADA':'DEVOLVIDA';
  updateBy_(sh,'SOLICITACOES','ID_SOLICITACAO',requestId,{STATUS:status,ID_RESPONSAVEL:u.ID_USUARIO,DATA_DECISAO:new Date(),DECISAO:decision,OBSERVACAO:String(observation||'').slice(0,2000)});
  audit_(u.ID_USUARIO,'TRE','DECISAO_'+decision,'SUCESSO','Solicitação '+requestId+'.');
  return {ok:true,status};
}
function apiTreSign(token,requestId){
  const s=session_(token),u=s.user;
  requireModule_(u,'TRE','ASSINAR');
  const sh=moduleDb_('TRE'),req=rows_(sh,'SOLICITACOES').find(x=>String(x.ID_SOLICITACAO)===String(requestId));
  if(!req)throw new Error('Solicitação não encontrada.');
  if(String(req.STATUS)!=='AGUARDANDO_ASSINATURA_COORDENADOR')throw new Error('Solicitação não está aguardando assinatura.');
  assertScope_(u,'TRE',req.ID_USUARIO);
  updateBy_(sh,'SOLICITACOES','ID_SOLICITACAO',requestId,{STATUS:'CONCLUIDA',DATA_ASSINATURA:new Date(),ID_ASSINANTE:u.ID_USUARIO});
  audit_(u.ID_USUARIO,'TRE','ASSINATURA_COORDENADOR','SUCESSO','Solicitação '+requestId+' assinada.');
  return {ok:true,status:'CONCLUIDA'};
}
