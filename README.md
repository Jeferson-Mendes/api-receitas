## Api de receitas

Uma api para organizar e encontrar as mais diversas receitas. Para uma experiência ainda mais bacana, foi implementado um sistema de autenticação e upload de imagem usando o cloudinary :)

#### Tools
* node
* express
* mongoDB
* mongoose
* bcrypt
* JWT
* Multer
* Cloudinary

#### Para testar na sua máquina
* Ter o [mongoDB](https://www.mongodb.com/) instalado
* Ter o [nodejs](https://nodejs.org/en/) instalado
* Rodar o servidor mongo antes de iniciar a aplicação: comando `mongod` no terminal do windows, por exemplo.

### Entendendo a api:

##### Requisições relacionadas a usuário

> A nossa `Base_url` está como: `http://localhost:3333`

| Verbo | Endereço			 	| Descrição 							| O que passar |
|-		|	   	  			-	|	-   								| - 		   |
|**GET**	|`Base_url`/user/all 	|Lista os usuários cadastrados 		 	|			   |
|**GET**	|`Base_url`/user/:id 	|Retorna todas as receitas de um usuário| `parameter:` Id do usuário|
|**POST**	|`Base_url`/user/create | Cadastra um novo usuário				|`body:` {name, email,password,favorite_food}		   |
|**POST** | `Base_url`/user/authenticate | Autenticação de usuário			|`body:`{email, password}


##### Requisições relacionadas a receita

> O token deve ser informado no `Authorization` do `Header`, e contem o seguinte formato: 
> `Authorization: Bearer [token]`

> Obs1: Não esqueça de remover os colchetes( "[ ]" )

> Obs2: De agora em diante todas as requisições necessitam de token, com exceção da **primeira** e **segunda**, que nos retorna a lista de receitas, e receitas específicas a depender da palavra chave informada na query. ;)


| Verbo | Endereço			 	| Descrição 							| O que passar |
|-		|	   	  			-	|	-   								| - 		   |
|**GET**	|`Base_url`/recipe 	|Nos retorna as receitas cadastradas 		 	|		   |
|**GET**	|`Base_url`/recipe/search?search_query={lasanha}	| Nos retorna todas as receitas que possuem a palavra chave | `query:` **search_query** com a palavra chave
|**POST**	|`Base_url`/recipe/create 	|Cria uma receita| `body:`{ title: "teste", description: "teste", ingredients: ["01","02"], preparation_steps: ["01","02"], key_words: ["teste","teste"]}|
|**PUT**	|`Base_url`/recipe/update | Edita uma receita			|`body:`{ title: "teste", description: "teste", ingredients: ["01","02"], preparation_steps: ["01","02"], key_words: ["teste","teste"]}	`header: RecipeId (id da receita)`	   |
|**DELETE** | `Base_url`recipe/delete/:id | Deleta uma receita			|`parameter:`Id da receita

---

Por: [Jeferson Mendes](https://www.linkedin.com/in/jeferson-mendes/)

---
