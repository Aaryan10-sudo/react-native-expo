import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { View } from 'react-native'

const TabRoot = () => {
  return (
   <Tabs screenOptions={{ headerShown: false, tabBarLabelStyle: {
    fontSize: 13, color: 'black'
   }, tabBarStyle: {
    height: 80, paddingBottom: 10
   } }}  >
    <Tabs.Screen name="index" options={{  tabBarIcon: ()=>(<Ionicons size={25} name='home'/>)} } />
    <Tabs.Screen name="about" options={{ title: 'Scan', tabBarIcon:()=>{
      return (
        <View style={{backgroundColor: "black", height: 60, width: 60, borderRadius: 100, bottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons size={30} color={'white'} name='scan'/>
        </View>
      )
    } }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon:()=>(
      <Ionicons size={25} name='person'/>
    ) }} />
   </Tabs>
  )
}

export default TabRoot