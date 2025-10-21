## Routing (Page Router)

Anything created inside the `app` directory is treated as a route when using the Expo Router (file-based routing).

For example:

```
app/about.jsx
```

The file `about.jsx` becomes a route (a navigation screen) in your app.

Quick steps

1. Create a page file inside `app` (for example `about.jsx`).
2. Export a component from that file — it will become a route.
3. Use `Link` from `expo-router` to navigate between routes.

Examples

- Create a new route file (POSIX):

```bash
cd app
touch about.jsx
```

- Create a new route file (PowerShell):

```powershell
cd app
New-Item about.jsx -ItemType File
```

- Minimal `about.jsx` component:

```jsx
import React from 'react';
import { View, Text } from 'react-native';

export default function About() {
   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>About page</Text>
      </View>
   );
}
```

- Add a `Link` to `index.jsx` to navigate to the About page:

```jsx
import { Link } from 'expo-router';

export default function Index() {
   return <Link href={'/about'}>About</Link>;
}
```

Notes

- Make sure to import `Link` from `expo-router`.
- When you click the `About` link, the router will navigate to the `about` page automatically.
