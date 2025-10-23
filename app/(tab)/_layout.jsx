import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

const TabRoot = () => {
  return (
   <Tabs screenOptions={{ headerShown: false }} >
    <Tabs.Screen name="index" options={{  tabBarIcon: ()=>(<Ionicons name='home'/>)}} />
    <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: ()=>(<Ionicons name='
    about'/>) }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
   </Tabs>
  )
}

export default TabRoot