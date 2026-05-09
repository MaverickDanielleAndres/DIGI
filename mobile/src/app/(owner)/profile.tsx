/**
 * Digi — Profile Tab
 */
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors, fonts, radius } from '@/theme';

export default function ProfileTab() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
        router.replace('/(auth)/onboarding');
      }},
    ]);
  };

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(user?.display_name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{user?.display_name || 'User'}</Text>
        <Text style={s.email}>{user?.email || ''}</Text>
        <View style={s.planBadge}>
          <Text style={s.planText}>{(user?.plan || 'free').toUpperCase()}</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>ACCOUNT</Text>
        {[
          {label:'Memory Vault',icon:'🗃️', route: '/(owner)/vault'},
          {label:'Upgrade to Creator',icon:'⭐', route: '/(owner)/paywall'},
          {label:'Edit Profile',icon:'✏️'},
          {label:'My Badges',icon:'🏆'},
          {label:'Notifications',icon:'🔔'},
          {label:'Privacy & Security',icon:'🔒'},
        ].map((item,i) => (
          <Animated.View key={item.label} entering={FadeInDown.delay(i*60)}>
            <Pressable 
              style={s.menuRow}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <Text style={s.menuIcon}>{item.icon}</Text>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuArrow}>›</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Pressable style={s.signOut} onPress={handleSignOut}>
        <Text style={s.signOutText}>Sign Out</Text>
      </Pressable>
      <View style={{height:100}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void},
  header:{alignItems:'center',paddingTop:80,paddingBottom:24},
  avatar:{width:80,height:80,borderRadius:40,backgroundColor:colors.amber+'20',justifyContent:'center',alignItems:'center',marginBottom:16},
  avatarText:{fontFamily:fonts.heading,fontSize:32,color:colors.amber},
  name:{fontFamily:fonts.heading,fontSize:24,color:colors.cream},
  email:{fontFamily:fonts.body,fontSize:14,color:colors.parchment,marginTop:4},
  planBadge:{backgroundColor:colors.amber+'20',paddingHorizontal:16,paddingVertical:6,borderRadius:radius.pill,marginTop:12},
  planText:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:1.5,color:colors.amber},
  section:{paddingHorizontal:24,marginTop:8},
  sectionTitle:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:2,color:colors.amber,marginBottom:12},
  menuRow:{flexDirection:'row',alignItems:'center',paddingVertical:16,borderBottomWidth:1,borderBottomColor:colors.smoke,gap:12},
  menuIcon:{fontSize:20},
  menuLabel:{fontFamily:fonts.bodyMedium,fontSize:15,color:colors.cream,flex:1},
  menuArrow:{fontFamily:fonts.heading,fontSize:20,color:colors.ash},
  signOut:{marginHorizontal:24,marginTop:32,height:52,borderRadius:radius.md,backgroundColor:colors.coral+'15',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:colors.coral+'30'},
  signOutText:{fontFamily:fonts.headingSemiBold,fontSize:15,color:colors.coral},
});
