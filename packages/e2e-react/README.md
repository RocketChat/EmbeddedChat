# E2E EmbeddedChat setup
1. Create an `.env` with your Rocket.Chat username and password
```
USERNAME=[your_username]
PASSWORD=[your_password]
```
2. Make sure EmbeddedChat is running on `http://localhost:6006`
3. Run E2E tests
```
yarn test
```
Or run tests in interactive UI
```
yarn test --ui
```
