# Homepage van je Huis

**What is Homepage van je Huis?**

Coming soon

<details>
<summary>Table of contents</summary>

- [Stack](#stack)
- [🚀 Getting started](#-getting-started)
- [Adding components](#-adding-components)
- [Storybook & Plop](#-storybook-&-plop)
- [Browser & device support](#-browser-&-device-support)

</details>

## Stack

- [Nuxt3](https://nuxt.com/)
- Typescript
- [Vite](https://vitejs.dev/)
- [Storybook](https://storybook.js.org/)
- Less

## 🚀 Getting started

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm)
2. Run `nvm i` to install/use the correct node version as described in .nvmrc
3. Run `npm i` to install all dependencies
4. Configure and use prettier and editor config in your IDE of choice to conform to the project formatting rules
5. Run `npm run dev` to start development server and navigate to `localhost:[PORT]/nl/` in your browser as we don't have a homepage and `localhost:[PORT]/` will give a `404`
6. Run `npm run storybook` to start Storybook, here you can find all the components. See [Storybook](#storybook)

To run a production build:

- Run `npm run build`
- Run `npm run preview`

### Adding components

We use plop to add new components. This way all new components have an accompanying story and are uniform.

`npm run plop [name of your component]`

### Storybook & Plop

We use [Storybook](https://storybook.js.org/) to build all the components and pages. This way we can built isolated and create a nice overview of all the components we have.
Run `npm run storybook` to open Storybook. Documentation of the components can be found here as well.

Creating a new component:

1. Run Storybook: `npm run storybook`
2. Now you can see your component in Storybook
3. Start building!

### Browser & device support

\_Last updated: 06/02/2024
| Browser | Supported version |
| :--- | ---: |
| Safari | 14 and up |
| Chrome | 108 and up |
| Edge | 112 and up |
| Samsung Internet | 19 and up |
| Firefox | 78 and up |
| Android webview | 112 and up |

We use the following breakpoints to cover all screen sizes:
| Breakpoint | Pixels |
| :--- | ---: |
| Mobile | 320 |
| Tablet | 600 |
| Desktop-md | 1024 |
| Desktop-lg | 1360 |
| Desktop-xl | 1920 |

See the [browser & device list docs](./docs/BrowserDeviceList.md) for a full report of the researched Analytics data to determine the browser and device support.
