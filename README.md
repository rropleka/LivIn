# Livin

Livin is a web application designed to provide a single point of access for housing options specifically tailored to university students nationwide. Users can sign up as Renters or Leasing companies, with different permissions based on their roles.

## Inspiration

The idea for Livin came from a desire to create a platform where students can easily find housing options and connect with potential roommates, based on shared experiences at university campuses.

## Purpose

The primary purpose of Livin is to reconnect students with housing options and potential roommates, enhancing their university experience.

## Features

- **User Authentication & Authorization**: Secure login and role-based access control.
- **Resident Connections**: Connect users as potential residents.
- **Property Ratings & Reviews**: Rate properties and add reviews for both properties and leasing companies.
- **Integrated Map**: Utilizes Google Maps API and CityBus route data for dynamic filtering of points of interest.
- **Dynamic Filtering**: Filter properties and points of interest dynamically.

## Technologies

- **Frontend**: Vue.js (HTML, JS, CSS)
- **Backend**: Firebase (Authentication & Database)
- **APIs**: Google Maps API
- **Language**: TypeScript

## Project Setup

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) 
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Type Support for `.vue` Imports in TypeScript

TypeScript does not handle type information for `.vue` imports by default. To enable type checking:

1. Replace the `tsc` CLI with `vue-tsc` for type checking.
2. Install [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

For improved performance, enable Volar's [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669):

1. Disable the built-in TypeScript Extension:
   - Run `Extensions: Show Built-in Extensions` from VSCode's command palette.
   - Find `TypeScript and JavaScript Language Features`, right-click, and select `Disable (Workspace)`.
2. Reload the VSCode window:
   - Run `Developer: Reload Window` from the command palette.

### Customize Configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Installation

```sh
npm install
```

### Development

Compile and hot-reload for development:

```sh
npm run dev
```

### Production

Type-check, compile, and minify for production:

```sh
npm run build
```

### Linting

Lint with [ESLint](https://eslint.org/):

```sh
npm run lint
```



