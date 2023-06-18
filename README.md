# Kugel Pre Processor

Kugel Pre Processor é um conversor de arquivos que precisam ser compilados em tempo de desenvolvimento. Com ele, é possível transformar arquivos .sass, .scss, .pug e outras extensões em CSS e HTML.

## Instalação

Você pode instalar o Kugel Pre Processor pelo npm utilizando o seguinte comando:

```
npm install kugel-pre-processor
```

## Utilização

Para utilizar o Kugel Pre Processor, você deve seguir os passos abaixo:

1. Importe o módulo `kugel-pre-processor` em seu código utilizando o seguinte comando:

```javascript
const preProcessor = require('kugel-pre-processor');
```

2. Utilize o método `add` para adicionar uma nova extensão que deverá ser processada. O método `add` recebe dois parâmetros:

- `procedure`: é o nome do procedimento que será executado. Atualmente, estão disponíveis os procedimentos `sass` e `pug`. É possível criar novos procedimentos seguindo as instruções na seção "Criando novas extensões".
- `content`: é um objeto que deve conter as seguintes propriedades:

    - `src`: indica a pasta onde os arquivos a serem transformados se encontram.
    - `filter`: é uma função utilizada para filtrar os arquivos que serão transformados. O parâmetro recebido é o caminho completo do arquivo. A função deve retornar true se o arquivo deve ser processado e false caso contrário.
    - `pre` (opcional): é uma função para ser executada antes do processo ser aplicado no arquivo. Recebe como parâmetro o caminho completo do arquivo a ser transformado. O retorno da função será utilizado como caminho do arquivo que deve ser processado. Caso a função não seja definida, o caminho original será utilizado.
    - `dest` (opcional): é uma função para definir onde o arquivo que será processado deve ser salvo. Recebe como parâmetro o caminho completo do arquivo original e deve retornar o caminho onde o arquivo processado deve ser salvo. Caso a função não seja definida, o arquivo processado será salvo com o mesmo nome e extensão na mesma pasta do arquivo original.

Veja o exemplo abaixo:

```javascript
const path = require('path');
const preProcessor = require('kugel-pre-processor');

// processa todos os arquivos .sass e .scss da pasta pública e os salva na pasta pública
preProcessor.add('sass', path.join(__dirname, 'public'));

// processa todos os arquivos .pug da pasta views e salva o arquivo index.pug como index.html na pasta pública
preProcessor.add('pug', {
    src: path.join(__dirname, 'views'),
    filter: (filename) => filename.indexOf('views/index.pug') !== -1,
    pre: (filename) => path.join(__dirname, 'views', 'index.pug'),
    dest: (filename) => filename.replace('views', 'public')
});
```

3. Assim que o processo rodar, os arquivos serão transformados e salvos no local indicado pela propriedade `.dest` ou no mesmo local do arquivo original caso a propriedade `.dest` não seja definida. O processo rodará sempre que um arquivo for alterado.

## Extensões suportadas

O Kugel Pre Processor atualmente suporta as seguintes extensões:

- .sass
- .scss
- .pug

Se você tiver outras extensões que deseja processar, pode seguir as instruções na seção "Criando novas extensões".

## Criando novas extensões

Para criar uma nova extensão a ser utilizada no Kugel Pre Processor, você deve seguir os passos abaixo:

1. Crie uma nova pasta dentro da pasta `procedures`. O nome da pasta deve ser igual ao nome da extensão a ser criada.

2. Crie um arquivo `nome-da-extensao.js` dentro da pasta `procedures/nome-da-extensao`. O nome do arquivo deve ser igual ao nome da extensão a ser criada.

3. Crie uma função dentro do arquivo `nome-da-extensao.js` que receberá o caminho completo do arquivo a ser processado como parâmetro. Essa função deve realizar o processamento necessário e salvar o arquivo processado no local indicado pelo objeto `content.dest`. Caso a propriedade `content.dest` não seja definida, utilize o mesmo nome e extensão do arquivo original na mesma pasta.

4. Exporte a função criada no passo 3, para que ela possa ser utilizada pelo Kugel Pre Processor.

5. Adicione a extensão ao Kugel Pre Processor utilizando o método `add`, como indicado na seção "Utilização". O valor de `procedure` deve ser o mesmo nome utilizado na pasta criada no passo 1.

- Certifique-se de que as funções de processamento não causem alterações não intencionais no arquivo original.
- As funções de processamento devem receber o caminho completo do arquivo como parâmetro e devem retornar o caminho do arquivo processado que deve ser salvo.
- Todos os arquivos processados devem ser salvos em seus destinos corretos, que podem ser definidos com as funções `.pre` e `.dest`.
- Para que sua extensão funcione corretamente, é necessário adicionar a extensão com o método `add`, fornecendo o nome da sua extensão e as configurações necessárias.

### Filtrando arquivos com função de filtro personalizada

Se você deseja filtrar arquivos de outra forma que não seja pela sua extensão, pode criar sua própria função de filtro. Para fazer isso, defina uma função que recebe o caminho completo do arquivo como parâmetro e retorna true se o arquivo deve ser processado e false caso contrário. Por exemplo:

```javascript
const preProcessor = require('kugel-pre-processor');
// configurações

// processa apenas arquivos com a palavra 'styles' no nome
preProcessor.add('sass', {
    src: 'src',
    filter: (filename) => filename.indexOf('styles') !== -1,
});
```

### Definindo o destino de arquivos processados com uma função personalizada

Se você deseja personalizar o destino de um arquivo processado, pode definir uma função `dest` que recebe o caminho completo do arquivo original e retorna o caminho onde o arquivo processado deve ser salvo. Por exemplo:

```javascript
const preProcessor = require('kugel-pre-processor');
// configurações

// processa um arquivo .pug na pasta views e salva o arquivo .html na pasta output
preProcessor.add('pug', {
    src: 'views',
    filter: (filename) => filename.indexOf('.pug') !== -1,
    dest: (filename) => {
        const basename = path.basename(filename, '.pug');
        return path.join(__dirname, 'output', basename + '.html');
    },
});
```