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

## Tabs (Bottom Tabs) routing

Expo Router supports nested layouts and a `Tabs` component for bottom tab navigation. A common pattern is to place your tab layout inside a folder (for example `(tabs)`) and include a `_layout.tsx` that returns a `Tabs` component.

Recommended file structure:

```
app/
   (tabs)/
      _layout.tsx     <-- Tab navigator
      index.tsx       <-- First tab screen
      explore.tsx     <-- Second tab screen
   _layout.tsx       <-- Root layout (optional)
   index.tsx
```

Example `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
   return (
      <Tabs>
         {/* screens are picked up from files in this folder */}
      </Tabs>
   );
}
```

Example tab screens:

`app/(tabs)/index.tsx` (Home tab)

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function HomeTab() {
   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Home Tab</Text>
      </View>
   );
}
```

`app/(tabs)/explore.tsx` (Explore tab)

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function ExploreTab() {
   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text>Explore Tab</Text>
      </View>
   );
}
```

Customizing tabs

- To hide headers for tabs globally, add `screenOptions={{ headerShown: false }}` to `<Tabs />`.
- To add icons, use `Tabs.Screen` with `options` and provide a `tabBarIcon`.

Example with options and icons (using `@expo/vector-icons`):

```tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
   return (
      <Tabs screenOptions={{ headerShown: false }}>
         <Tabs.Screen
            name="index"
            options={{
               title: 'Home',
               tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
            }}
         />
         <Tabs.Screen
            name="explore"
            options={{
               title: 'Explore',
               tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
            }}
         />
      </Tabs>
   );
}
```

Notes

- Grouping route folders with parentheses (like `(tabs)`) is a recommended convention to avoid the folder name appearing in the URL.
- The Expo Router automatically maps files to routes; use nested folders and `_layout.tsx` files to compose complex navigation.
