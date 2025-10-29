# HiddenDomain
Lightweight tool to store and view a note securely and indefinitely by leveraging Codedpad.

# 1. Installations
## 1.1 Github
```
git clone https://github.com/I2rys/hiddendomain
```

## 1.2 NpmJS
```
npm install
```

## 1.2 PNPM
```
pnpm install
```

# 2. Usage
```
node index.js <input/output> <core-phrase> <secret>
```

## 2.1 Example
```
node index.js output I2rysFavoriteFood Batman's Cave
```

## 2.2 Explanation
- **input/output:** Input refers to updating the note, Output refers to retrieving the content of the note.
- **core-phrase:** Think of it as a key, perhaps your crush name? (no spaces).
- **secret:** Think of it as the location of the note, it's secret path (spaces allowed).