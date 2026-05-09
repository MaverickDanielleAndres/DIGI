/**
 * Digi — Owner Layout (Main App)
 * 
 * Bottom tab navigation for authenticated event owners.
 * 5 tabs: Home, Events, Camera, Album, Profile
 */
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    events: '📅',
    camera: '📷',
    album: '🖼️',
    profile: '👤',
  };

  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <View style={styles.emojiContainer}>
        <View>
          {/* Using text emoji as placeholder — replace with custom SVG icons */}
          <View style={{ opacity: focused ? 1 : 0.5 }}>
            <View style={styles.iconWrap}>
              {/* Placeholder icon text */}
            </View>
          </View>
        </View>
      </View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function OwnerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.ash,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ focused }) => <TabIcon name="events" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ focused }) => <TabIcon name="camera" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="album"
        options={{
          title: 'Album',
          tabBarIcon: ({ focused }) => <TabIcon name="album" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.charcoal,
    borderTopColor: colors.smoke,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
  },
  tabIconActive: {},
  emojiContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: 24,
    height: 24,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.amber,
    marginTop: 4,
  },
});
