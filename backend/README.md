# Sistema-Academico

* Instalar as dependencias:

```bash
npm install
```

```bash
yarn
```

* Rodar o projeto

```bash
yarn dev
```

* Criar uma migration:

```bash
yarn typeorm migration:create -n CreateUsers
```

* Rodar as migrations

```bash
yarn typeorm migration:run
```

* Desfazer alterações da migration

```bash
yarn typeorm migration:revert
```