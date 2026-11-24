/**
 * SAP — endpoints iniciais da camada integrada.
 * Regra funcional: Supervisor ou Supervisor Técnico decide; Coordenador não assina no SAP.
 * Os campos específicos do formulário SAP serão mapeados na etapa de especificação funcional.
 */
function apiSapQueue(token){
  const s=session_(token); requireModule_(s.user,'SAP','VISUALIZAR');
  const scope=scopeIds_(s.user,'SAP');
  return rows_(moduleDb_('SAP'),'SOLICITACOES').filter(r=>scope.all||scope.ids.has(String(r.ID_USUARIO))||String(r.ID_USUARIO)===String(s.user.ID_USUARIO));
}
function apiSapDecide(token,requestId,decision,observation){
  const s=session_(token); const u=s.user;
  if(!['APROVAR','REPROVAR','DEVOLVER'].includes(decision))throw new Error('Decisão inválida.');
  requireModule_(u,'SAP','APROVAR');
  const sh=moduleDb_('SAP'), req=rows_(sh,'SOLICITACOES').find(x=>String(x.ID_SOLICITACAO)===String(requestId));
  if(!req)throw new Error('Solicitação não encontrada.');
  assertScope_(u,'SAP',req.ID_USUARIO);
  if(!['SUBMETIDA','EM_ANALISE','DEVOLVIDA'].includes(String(req.STATUS)))throw new Error('Solicitação não está disponível para decisão.');
  const status=decision==='APROVAR'?'APROVADA':decision==='REPROVAR'?'REPROVADA':'DEVOLVIDA';
  updateBy_(sh,'SOLICITACOES','ID_SOLICITACAO',requestId,{STATUS:status,ID_RESPONSAVEL:u.ID_USUARIO,DATA_DECISAO:new Date(),DECISAO:decision,OBSERVACAO:String(observation||'').slice(0,2000)});
  audit_(u.ID_USUARIO,'SAP','DECISAO_'+decision,'SUCESSO','Solicitação '+requestId+'. SAP não possui assinatura de Coordenador.');
  return {ok:true,status};
}
function requireModule_(u,module,operation){
  const p=rows_(central_(),'PERMISSOES').find(x=>String(x.PERFIL_ID)===String(u.PERFIL_ID)&&String(x.MODULO_ID)===module&&String(x.STATUS_VALIDACAO)==='APROVADO_PELO_USUARIO');
  if(!p||p[operation]!==true)throw new Error('Permissão não concedida para '+module+'/'+operation+'.');
}

