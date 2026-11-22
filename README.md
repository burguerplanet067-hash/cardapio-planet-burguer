# 🍔 Planet Burguer — Cardápio Digital

Seu cardápio digital está pronto! Este guia explica, em linguagem simples,
como colocá-lo no ar — **sem precisar programar nada**.

---

## O que você recebeu

```
planet-burguer/
├── index.html          → a página do cardápio (não precisa mexer)
├── css/style.css        → o visual do site (não precisa mexer)
├── js/app.js             → o funcionamento do site (não precisa mexer)
├── js/config.js          → 🔧 O ARQUIVO QUE VOCÊ VAI EDITAR
├── images/                → fotos/ilustrações dos produtos
└── README.md              → este guia
```

**Você só precisa editar o arquivo `js/config.js`.** É nele que ficam:
- o número de WhatsApp da loja
- os produtos, preços e descrições
- os adicionais e formas de pagamento

Ele tem comentários explicando cada parte. Abra com o Bloco de Notas,
o Notepad++, ou qualquer editor de texto simples.

---

## PASSO 1 — O que baixar

Baixe a pasta completa `planet-burguer` que está sendo entregue a você
(todos os arquivos juntos, mantendo essa estrutura de pastas).

---

## PASSO 2 — Onde criar conta

Vá até **https://vercel.com** e crie uma conta gratuita (pode entrar
com Google, GitHub ou e-mail). A Vercel é uma das formas mais simples
e gratuitas de colocar um site no ar.

---

## PASSO 3 — Onde colocar o projeto

1. Depois de logar na Vercel, clique em **"Add New..." → "Project"**.
2. Procure a opção de enviar arquivos diretamente (**"Deploy" /
   arrastar pasta**) — não é necessário usar GitHub.
3. Arraste a pasta `planet-burguer` (ou selecione todos os arquivos
   dela) para a área indicada.

> 💡 Alternativa ainda mais simples: o site **https://app.netlify.com/drop**
> permite arrastar a pasta e gerar um link funcionando em segundos,
> sem nem precisar criar conta. Funciona igualmente bem para este projeto.

---

## PASSO 4 — Como publicar

Depois de enviar a pasta, clique em **"Deploy"** (ou espere o Netlify
Drop terminar o upload). Em menos de um minuto, a plataforma vai gerar
um link do tipo:

```
https://planet-burguer.vercel.app
```

Pronto — seu cardápio já está no ar! 🚀

---

## PASSO 5 — Como configurar o WhatsApp

1. Abra o arquivo `js/config.js` no computador.
2. Encontre a linha:
   ```js
   const WHATSAPP_NUMBER = "5521999999999"; // <-- TROQUE AQUI
   ```
3. Troque pelo número real da loja, **com código do país (55) + DDD**,
   sem espaços, traços ou parênteses.
   Exemplo: (21) 99999-9999 → `"5521999999999"`
4. Salve o arquivo.
5. Envie a pasta atualizada novamente para a Vercel/Netlify (arraste
   de novo — isso cria uma nova versão publicada com a alteração).

O mesmo vale sempre que você quiser mudar produtos, preços ou fotos:
edite `js/config.js`, salve, e publique a pasta de novo.

---

## PASSO 6 — Como obter o link do cardápio

O link é o endereço gerado no PASSO 4 (ex: `https://planet-burguer.vercel.app`).
Você pode copiá-lo direto do painel da Vercel/Netlify a qualquer momento.

Se quiser um endereço com o nome exato da sua marca (ex:
`planetburguer.com.br`), você pode comprar um domínio próprio (em sites
como Registro.br ou Namecheap) e configurá-lo dentro do painel da
Vercel, na aba **"Domains"** — o próprio painel explica o passo a passo
com um assistente visual.

---

## PASSO 7 — Como colocar o link no Instagram

1. Abra o Instagram da loja e vá em **"Editar perfil"**.
2. No campo **"Site"**, cole o link do cardápio.
3. Salve. O link vai aparecer clicável na sua bio.
4. Nos stories, você também pode usar o adesivo **"Link"** apontando
   para o mesmo endereço.

---

## PASSO 8 — Como gerar um QR Code

1. Acesse um gerador gratuito, como **https://www.qrcode-monkey.com**
   ou **https://qrcode.tec-it.com/pt**.
2. Cole o link do seu cardápio (do PASSO 6).
3. Gere e baixe a imagem do QR Code.
4. Imprima e coloque nas mesas, no balcão, nas embalagens ou nos
   cartões da loja — o cliente aponta a câmera do celular e o cardápio
   abre na hora.

---

## Como o pedido chega até você

O cliente escolhe os produtos, monta o carrinho, preenche nome,
endereço (se for entrega) e forma de pagamento. Ao clicar em
**"Finalizar Pedido pelo WhatsApp"**, o site monta a mensagem
automaticamente e abre o WhatsApp da loja (o número do PASSO 5) já
com tudo preenchido — o cliente só precisa apertar enviar.

---

## 🍟 Como funciona o "virar combo"

Em vez de ter combos como produtos separados no cardápio, cada
hambúrguer que tiver a opção liberada mostra, na própria tela do
produto, um interruptor **"Quer virar combo?"** — se o cliente
ativar, o pedido já sai com o acréscimo (por padrão: batata frita M +
refrigerante lata) e o valor extra configurado, tudo automático no
carrinho, no checkout e na mensagem do WhatsApp.

- Para decidir quais hambúrgueres mostram essa opção, edite o campo
  `permiteCombo: true` (ou `false`) de cada produto em `js/config.js`
  — ou, mais fácil, marque/desmarque a caixinha **"Permite virar
  combo"** de cada produto no painel `/admin.html`.
- O texto e o valor do acréscimo ficam no bloco `COMBO_ADDON` do
  `js/config.js` (ou na aba "Loja & WhatsApp" do painel admin).
- O **Combo Kids** continua sendo um produto próprio e completo (não
  usa esse interruptor), já que ele já é um combo fechado.

## 🔐 Painel Administrativo (editar sem mexer em código)

Além de editar `js/config.js` diretamente, você tem uma segunda opção
bem mais visual: a página **`admin.html`**.

### Como acessar

Depois de publicado, acesse:
```
https://SEU-LINK-AQUI.vercel.app/admin.html
```

A senha padrão é `planetburguer2026` — **troque essa senha assim que
possível** na própria aba "Loja & WhatsApp" do painel.

> ⚠️ **Importante sobre segurança:** este site é 100% estático (sem
> banco de dados nem servidor próprio), então essa senha fica guardada
> dentro do próprio código do site. Ela é suficiente para impedir que
> um cliente comum encontre e mexa por acaso, mas **não é uma proteção
> forte** contra alguém com conhecimento técnico. Não use no
> `admin.html` nenhuma senha que você usa em outro lugar importante.

### O que dá para editar no painel

- Produtos (nome, categoria, descrição, ingredientes, preço, imagem,
  destaque, disponibilidade, adicionais permitidos)
- Categorias
- Adicionais e seus preços
- Formas de pagamento
- Nome da loja, slogan, Instagram
- Número do WhatsApp
- Senha do próprio painel

### Como funciona (e sua principal limitação)

Como não existe banco de dados, o painel guarda suas alterações
**apenas no navegador que você está usando** enquanto você edita.
Para essas mudanças aparecerem de verdade para os seus clientes, você
precisa:

1. Fazer as edições no painel.
2. Clicar em **"⬇️ Baixar config.js atualizado"** — isso baixa um novo
   arquivo `config.js` para o seu computador.
3. Substituir o arquivo `js/config.js` da sua pasta do projeto por
   esse novo arquivo baixado.
4. Publicar a pasta de novo (arrastar para a Vercel/Netlify, como no
   PASSO 3).

Ou seja: o painel **não publica sozinho** — ele só gera o arquivo
pronto para você reenviar. Isso é o que permite esse site continuar
sendo gratuito e simples, sem precisar de banco de dados, login de
verdade ou serviços externos pagos.

> 💡 Se no futuro você quiser que as alterações apareçam para os
> clientes instantaneamente (sem precisar rebaixar/republicar toda
> vez), isso é possível, mas exige adicionar um banco de dados e
> autenticação de verdade — um projeto maior do que este cardápio
> estático. Se quiser evoluir para isso um dia, é só pedir.

---

## Dúvidas comuns

**Posso adicionar mais produtos depois?**
Sim — copie um bloco de produto dentro de `js/config.js`, cole abaixo
do último, e troque os dados. Comentários no arquivo explicam cada campo.

**Posso esconder um produto sem apagá-lo?**
Sim — troque `disponivel: true` para `disponivel: false` nesse produto.

**As fotos são definitivas?**
Não — são imagens de exemplo (placeholders). Troque os arquivos dentro
da pasta `images/` pelas fotos reais dos seus hambúrgueres (mesmo nome
de arquivo, ou atualize o caminho no campo `imagem` de cada produto em
`js/config.js`). Use fotos quadradas e leves (JPG ou WEBP) para o site
continuar rápido.

**Como funciona o aviso de "Estamos fechados"?**
Logo abaixo do topo do site, aparece uma faixa que mostra se a loja
está aberta 🟢 ou fechada 🔴 **naquele exato momento**, comparando o
horário do dispositivo do cliente com o horário configurado em
`js/config.js` (bloco `BUSINESS_HOURS`) ou no painel admin. Quando
fechado, aparece um link **"Deixar mensagem no WhatsApp →"** para o
cliente já mandar uma mensagem e ser atendido assim que a loja abrir.
O cardápio continua funcionando normalmente mesmo fora do horário —
esse aviso é só informativo, não bloqueia o pedido.
