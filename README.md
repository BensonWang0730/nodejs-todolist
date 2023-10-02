## express | mongoDB 製作 API

### 使用技術

- express
- mongoDB、mongoose
- jwt、bcryptjs

### API 介紹

以 RESTful 格式為主，其中主要分為兩個端口<br/>
`/api/v1/auth` 、`/api/v1/todos`

註冊（POST）：
`/api/v1/auth/register` <br/>
登入（POST）：
`/api/v1/auth/login` <br/>

填寫待辦事項（POST）：
`/api/v1/todos` <br/>
取得所有待辦事項（GET）：
`/api/v1/todos` <br/>
切換待辦狀態（POST）：
`/api/v1/todos/isdone` <br/>
刪除單一待辦（DELETE）：
`/api/v1/todos/:id` <br/>
