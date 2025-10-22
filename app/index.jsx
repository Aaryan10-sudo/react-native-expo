import { Link } from "expo-router";
import { Text, View } from "react-native";

const App = () => {
return(
  
  <View style={{padding: 10}}>
  <Text>Hello, World!</Text>
  <Link href="/about" style={{marginTop: 10, color: 'blue', textDecorationColor: 'blue', textDecorationLine: 'underline'}}>
    About
  </Link>
  <Link href="/about/dwevwev" style={{marginTop: 10, color: 'blue', textDecorationColor: 'blue', textDecorationLine: 'underline'}}>
    Test
  </Link>
  </View>
)
}


export default App;