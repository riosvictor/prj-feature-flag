## Descrição
Aplicação backend que manipula os dados das feature flags.


## Desenvolvimento
### Instalação das dependências

```bash
$ npm install
```

### Alterações no Schema de Banco de dados

```bash
# Criação de migrations
$ npx prisma migrate dev --name <migration-name>

# Atualização do Prisma Client
## Deve ser executado após toda alteração nos modelos
$ npx prisma generate

# para a criação e envio dos schemas para o DB
$ npx prisma db push

# execução dos seeds (dados iniciais) no DB
$ npx prisma db seed

# inicialização da interface que apresenta as tabelas do DB
$ npx prisma studio

```

### Running the app locally

```bash
$ npm run start:dev
```

### Running the app using Podman

```bash
# criação da imagem
$ podman build -t <image-name> .

# execução da imagem
$ podman run -d -p 3000:3000 <image-name>

```

### Running the app using Docker
Basta trocar os comandos acima de `podman` para `docker`

## Testes

```bash
# testes unitários
$ npm run test

# testes de integração
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```


## Tecnologias utilizadas

- [Nest](https://docs.nestjs.com/) NestJS é um framework para construção de aplicações server-side em Node.js, que utiliza conceitos do Angular para criar uma arquitetura modular e escalável. Ele é construído com TypeScript e oferece uma estrutura que facilita a organização do código, seguindo padrões como Injeção de Dependências, Módulos e Controladores.
- [Prisma](https://www.prisma.io) O Prisma ORM é um framework de mapeamento objeto-relacional (ORM) para Node.js e TypeScript. Ele simplifica a interação com bancos de dados, permitindo que você use uma linguagem de programação orientada a objetos para realizar operações de banco de dados, em vez de escrever consultas SQL diretamente.
- [Class Validator](https://github.com/typestack/class-validator) framework usado para simplificar a validação de classes ou objetos.
- [Class Transformer](https://github.com/typestack/class-transformer) framework usado na serialização de dados e transformação entre objetos e instância de uma classe.

## License

[MIT licensed](LICENSE).
