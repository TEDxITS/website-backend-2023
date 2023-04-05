# TEDxITS 2023 Backend

## Prerequisite
1. [Docker](https://docs.docker.com/desktop/install/windows-install)

## Starting Guide:
1. Clone project
2. Run `docker compose up -d`
3. Access `localhost:8000`

### Layering
Program flow goes through layers as below:  
`request` > router > controller > service > repository > service > controller > router > `response`

## Response Format
Response api functions are arranged in `ApiResponse` file containing:
1. sendData -> success with data return
2. sendOk -> success without data return
3. sendError -> error

Success
```
{
  data: [] or {},
  message: string
}
```
Error
```
{
  errors: {
    field1: [
      "errorMessage1",
      "errorMessage2"
    ],
    ...
  },
  message: string
}
```
