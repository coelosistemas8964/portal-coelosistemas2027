# Portal COELO — Fase 1 (ambiente de homologação)

## Conteúdo
- `COELO_BASE_CENTRAL_V2_17.xlsx`: cópia corrigida da V2.16. A V2.16 original não é alterada.
- `Code.gs`: autenticação, primeiro acesso em duas etapas, sessão, validação administrativa e roteamento.
- `SAP.gs`: fila e decisão inicial do SAP.
- `TRE.gs`: fila, decisão e assinatura em etapa separada no TRE.
- `Index.html`: interface inicial do Portal.
- `appsscript.json`: configuração do projeto Apps Script.

## Decisão funcional incorporada
- SAP: Supervisor ou Supervisor Técnico analisa e aprova/reprova. Não há assinatura do Coordenador.
- TRE: Supervisor ou Supervisor Técnico analisa e aprova/reprova; após aprovação, o Coordenador assina em etapa separada.
- A validação cadastral tem duas etapas: confirmação pelo colaborador e validação/aprovação final pelo Administrador.
- O acesso permanece bloqueado até aprovação administrativa.

## Preparação
1. Faça uma cópia de segurança da planilha central atual.
2. Envie `COELO_BASE_CENTRAL_V2_17.xlsx` ao Google Drive e abra/converta para Planilhas Google.
3. Crie um projeto Apps Script independente e adicione os arquivos `Code.gs`, `SAP.gs`, `TRE.gs` e `Index.html`.
4. Em **Configurações do projeto > Propriedades do script**, configure `CENTRAL_DB_ID` com o ID da planilha Google convertida.
5. Execute `setupInfrastructure()` e autorize as permissões solicitadas. A função cria bases separadas para autenticação, SAP e TRE.
6. Restrinja o compartilhamento das planilhas de autenticação, SAP e TRE aos administradores técnicos necessários.
7. Implante como Web App apenas para o público institucional autorizado e valide o domínio CBTU.

## Importante: não é produção
Este pacote é a fundação técnica inicial. Não contém ainda os formulários completos nem a migração dos dados operacionais dos sistemas SAP/TRE existentes. O formulário SAP precisa ser fechado na especificação funcional; o TRE precisa ter seu saldo, calendário, feriados, documentos e regras atuais migrados e testados. A matriz aprovada ainda não está ativada.
Não execute em produção, não habilite acesso amplo e não use dados reais até:
- configurar uma conta Administrador inicial de forma controlada;
- revisar o armazenamento e a política de credenciais com a equipe técnica;
- implementar o formulário completo e os relatórios;
- testar escopo hierárquico, bloqueio de acesso e auditoria;
- homologar com usuários de cada perfil;
- aprovar a ativação formal.

## Observação técnica
O código é um ponto de partida Apps Script e precisa de revisão de segurança e testes de carga. O mecanismo PBKDF2 implementado no Apps Script é uma proteção inicial; para produção, recomenda-se autenticação institucional centralizada (Google Workspace/Identity) ou serviço de identidade corporativo aprovado.

## Bootstrap do primeiro Administrador
1. O e-mail designado para o primeiro Administrador é `genilsoncarneiro@cbtu.gov.br` (já definido como padrão no código). Se necessário, pode ser sobrescrito pela propriedade `INITIAL_ADMIN_EMAIL`. A conta precisa existir na Base Central.
2. Execute `bootstrapFirstAdmin()` no editor Apps Script autenticado exatamente com essa conta Google institucional.
3. A conta designada receberá o código de primeiro acesso por e-mail e deverá concluir o primeiro acesso pelo portal. Esse procedimento controlado evita inventar ou pré-configurar uma conta de Administrador.
4. Depois do bootstrap, o Administrador deverá revisar os demais cadastros pendentes e atribuir os perfis corretos.

## Limites desta entrega
A tela do Portal e a navegação SAP/TRE estão iniciadas. As filas, decisões SAP/TRE e assinatura TRE estão previstas no backend inicial, mas ainda dependem de testes com dados de homologação. O cadastro completo das solicitações, os campos específicos do SAP, a migração integral do TRE (saldo, feriados, solicitações e PDFs) e o gerador final de documentos ainda não estão concluídos.
