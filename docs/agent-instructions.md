# Task: Write a documentation for kvant based on Fumadocs

This is the repo for a package `kvant` - a universal type-safe state manager for key-value interfaces.
Your task is to write a documentation for it based on the attached structure.
This task does not include making a home page, leave it as-is for now.

The fumadocs template has been initialized here, at `docs/`, this is where the final documentation should be located.
Please review the package, its specs (e2e test suites are located at e2e/) and the attached documentation structure first,
clarify details or ask questions (if any arise), and propose improvements to the structure, if you have any suggestions.
When you fully understand the task and is ready to start the work, say it.

---

Documentation should be separated into Fumadocs *root folders* (layout tabs) for each framework supported by kvant:
- React (/docs/react/**)
- Next (/docs/next/**) - default (/docs should redirect to /docs/next)
- Next (pages router) (/docs/next/pages/**)
- React Router (/docs/react-router/**)
- Vue (/docs/vue/**)
- Vue Router (/docs/vue-router/**)
- Nuxt (/docs/nuxt/**)

The example of a desired sidebar:
- *framework select (layout tabs)* (current example shows the resulting sidebar for Next.js)
- Getting Started
  - Introduction (/docs/next)
  - Comparison to nuqs (/docs/next/comparison-to-nuqs)
  - Installation (/docs/next/installation)
  - Quick Start (/docs/next/quick-start)
- Schema
  - Kvant Schema (/docs/next/schema)
  - Zod (/docs/next/schema/zod)
  - Custom schemas (/docs/next/schema/custom)
- Interfaces
  - Search Params (/docs/next/search-params)
  - Local Storage (/docs/next/local-storage)
  - Cookies (/docs/next/cookies)
- Going Further
  - Advanced Usage (/docs/next/advanced-usage)
  - Custom Adapters (/docs/next/custom-adapters)

Many documentation sections would be identical between frameworks,
so you should actively use Fumadocs MDX `include` feature to reuse sections, as well as the whole pages whenever possible.
Try to keep repetition to a minimum.

Make sure that the documentation is consistent across frameworks, and that the examples are relevant to the framework selected.

`kvant/schema` in the examples should be imported like this:
```ts
import * as kv from 'kvant/schema'

kv.string()
kv.number()
// ... etc.
```

All the hooks/composables examples should include `kvant/schema` usage, as omitting the schema when binding the value is not recommended.

Styling preferences:
- Use Simple Icons for framework logos in the layout tabs.
- Use Lucide icons for icons for pages in the "Getting Started" section, pages in other sections should be icon-free.
- General accent color should be the same as the currently selected framework's official color (e.g., React blue, Vue green, etc.).

---

Below is the proposed structure for the documentation, which you should follow when writing the docs.
Bullet points describe what should be included on the page, but the exact wording, structure and order is up to you.

## Getting Started

### Introduction

- what problem kvant solves and its benefits
- simple usage examples for common use-cases (demonstrate close to real-world usage for search params, cookies, local storage)

### Comparison to nuqs
This page should only be visible for React-based frameworks.

(nuqs source is available in the current workspace, look into it if needed)

- if a user is not familiar with nuqs, offer them to skip this page
- a quick intro on what nuqs is and how it relates to kvant
- a quick guide on key differences between nuqs and kvant with a couple of examples
- should mention support of a broad key-value interfaces in comparison to only search params in nuqs
- should mention support of multiple framework families in comparison to only React in nuqs
- should mention inability to set options on the call level (setState) - justify it with the fact that kvant is designed to mirror the original state API of a framework
- should mention that throttle/debounce is not yet supported (but planned in future releases)
- should repeat the example of setting up a custom throttle/debounce mechanism for kvant state, as in the Interfaces section

### Installation

- installation via different package managers (use fumadocs remark plugin)
- framework version compatibility table

### Quick Start

All of the examples should use hooks/composables predefined for specific adapters (e.g., `useSearchParams`, `useRouteQuery`, etc.)
and should not use the generic `useKvantState()` hook/composable. `useKvantState()` and `defineKvantState()` should only be covered later in the documentation as a more advanced usage.

- core principle of using kvant based on search params/route query, demonstrating a single key binding and multiple key bindings via key map and an example of passing options to the hook/composable
- simple usage examples for each supported key-value interface for the currently selected framework with some commonly used options
- reference links to the full documentation for supported key-value interfaces (to "Interfaces" section)
- quick start guide for setting default options globally via options providers

## Schema

### Kvant Schema

- brief on what schemas are for and why they are important for kvant
- brief introduction to `kvant/schema` schema library and its benefits on usage with kvant compared to Zod or other schema libraries
  - should mention bidirectionality, smart casting and the lack of errors by design
  - should mention Zod-like API and that if you are familiar with Zod, you will feel at home with `kvant/schema`
  - should mention that `kvant/schema` can also be used outside of kvant, for example, for server-side usage (in React Server Components, Next/Nuxt API routes, etc.) - provide an example relevant to the currently selected framework
- leave a reference to Zod section if users prefers to use Zod and to Custom section if users prefers to use other schema libraries or create their own schemas
- API documentation on all available schemas and utility methods (should be similar to [Zod docs](https://zod.dev/api))

### Zod

- clarify that kvant is fully compatible with Zod and Zod schemas can be easily passed to kvant hooks/composables
- however, highlight the fact that Zod schemas passed to kvant should never throw, meaning that they should either cover all possible cases or have a fallback in case of an error (using `.catch()`)
- guide on Zod installation
- a couple of examples, including examples with Zod codecs, preferably with some of the codecs presented at https://zod.dev/codecs#useful-codecs
- a reference to Zod docs for more information
- describe an advanced use-case: intersecting Zod and `kvant/schema` - for example, using `kvant/schema` to parse a value from the URL and then pipe it to Zod for further validation
(`kvant/schema` accepts any parse/encode-object in its wrappers and combinators, not just only kvant schemas). "Be careful with this power!"

### Custom schemas

- guide on creating a custom schema using plain object with `parse` and `encode` methods
- as with Zod schemas, highlight the fact that custom schemas passed to kvant should never throw
- guide on integrating a couple of other popular schema providers by adapting their API to kvant schema interface

## Interfaces

The pages in this section and its contents vary depending on the framework selected.

Each interface page should include:
- brief description of the interface mentioning supported features (cross-tab sync, etc.)
- guide on usage with example
- options reference table (use [Auto Type Table](https://www.fumadocs.dev/docs/ui/components/auto-type-table) for generating the table)

Documentation for the interfaces related to URL/history should contain a warning that since kvant does not yet provide
first-party support for throttle/debounce, you should currently either avoid binding state directly to quickly changing values (like text input or sliders)
or wrap the kvant state in custom throttle/debounce mechanism - provide a simple example using `react-use`.

### Search Params
Frameworks: Vue, React, Next, React Router

Should include a section describing advanced usage with a custom parser/serializer, with an example based on `qs`:
```ts
const { useState: useSearchParams } = defineKvantState(
  (keys, options) => useSearchParamsKvantAdapter(keys, {
    ...options,
    parseSearch: search => qs.parse(search, { ignoreQueryPrefix: true }),
    stringifySearch: values => qs.stringify(values, { encodeValuesOnly: true }),
  }),
)
```
Mention that with this you can now use the full power of `kvant/schema` to parse and complex structures (objects, nested arrays, etc.) in the URL - provide an example.

### Router Query
Frameworks: Next (pages router)

### Route Query
Frameworks: Vue Router, Nuxt

### Route Params
Frameworks: Vue Router, Nuxt

### Local Storage
Frameworks: All

- primary examples should use local storage
- should mention that the same can be done with session storage (via `useSessionStorage` hook/composable) and provide a simple example

### Cookies
Frameworks: All

If current framework supports SSR, you should include a setup guide for it using options providers and a `fallback` option, for example, in Next (app router):
```tsx
import { CookiesOptionsProvider } from 'kvant/react'
import { cookies } from 'next/headers'

// In layout or page
export default async function Root({ children }) {
  const cookieStore = await cookies()
  return (
    <CookiesOptionsProvider defaultOptions={{ fallback: cookieStore.toString() }}>
      {children}
    </CookiesOptionsProvider>
  )
}
```

## Going Further

### Advanced Usage

Shed light on the concept of adapters (do not go into details, just a brief overview)
and provide guide on advanced usage of kvant using `useKvantState()` and `defineKvantState()` (with examples using internal kvant adapters for current framework).

### Custom Adapters

- a short guide on how to create a custom adapter with references to internal kvant adapters for current framework.
- a short guide on creating custom framework-agnostic adapter,
while mentioning that it is plausible only if you plan to use this adapter across different frameworks,
otherwise it is better to create a framework-specific adapter.
