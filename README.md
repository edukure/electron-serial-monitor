
## Usage

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

### Todo
- [x] Create Serial Context
- [ ] Create Plotter in a new window
- [ ] Create serial events enum
- [x] Refactor SerialCommunication (remove adding event listeners)
- [ ] Implement Write operation in SerialCommuncation
- [ ] Change timestamp color to light grayish
- [x] Implement SerialContext in Monitor