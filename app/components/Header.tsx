import {Text, View, Image, StyleSheet} from 'react-native'
import IIITHLogo from '../../assets/images/iiit-logo.png'

export default function Header()
{
    return (
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 60}}>
            <Image source={IIITHLogo} style={styles.logo} />
            <Text style={styles.eMess}>eMess</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    eMess: {
        fontSize: 24,
        fontWeight: "700",
        color: "#062E60",
        textAlign: 'center'
    },
    logo: {
        width: 122,
        height: 61,
        marginBottom: 8
    }
})