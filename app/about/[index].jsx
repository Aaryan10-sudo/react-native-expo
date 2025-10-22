import { useSearchParams } from 'expo-router/build/hooks';
import { Text, View } from 'react-native';

const index = () => {
    const params = useSearchParams();
    
  return (
    <View>
      <Text>{params}</Text>
    </View>
  )
}

export default index