/**
 * Digi — Event Creation Wizard
 */
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Image, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useEventStore } from '@/store/event.store';
import { colors, fonts, radius } from '@/theme';

const EVENT_TYPES = ['wedding','birthday','debut','graduation','reunion','concert','festival','corporate','travel','custom'];
const CAMERA_STYLES = ['disposable','polaroid','vhs','vintage','film_grain','bw','camcorder','y2k','digicam','fisheye'];
const REVEAL_MODES = ['instant','delayed','end_of_event','scheduled','manual'];

const TEMPLATES = [
  { name: 'Standard Wedding', type: 'wedding', shots: 36, camera: 'polaroid', reveal: 'end_of_event' },
  { name: 'Wild Birthday', type: 'birthday', shots: 12, camera: 'disposable', reveal: 'instant' },
  { name: 'Secret Getaway', type: 'travel', shots: 24, camera: 'film_grain', reveal: 'manual' },
];

export default function CreateEventScreen() {
  const router = useRouter();
  const { wizard, updateWizard, setWizardStep, createEvent } = useEventStore();
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const steps = ['Details','Type','Camera','Reveal','Privacy','Done'];

  const handleNext = () => {
    if (wizard.step === 0 && !wizard.title.trim()) {
      Alert.alert('Required', 'Please enter an event name');
      return;
    }
    if (wizard.step < steps.length - 1) {
      setWizardStep(wizard.step + 1);
    }
  };

  const handleCreate = async (isDraft: boolean) => {
    setSubmitting(true);
    const { event, error } = await createEvent(isDraft);
    setSubmitting(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else if (event) {
      router.replace(`/(owner)/events/${event.id}`);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // allow video too
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateWizard({ coverPhotoUri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      {/* Progress */}
      <View style={s.progress}>
        {steps.map((_, i) => (
          <View key={i} style={[s.dot, i <= wizard.step && s.dotActive]} />
        ))}
      </View>
      <Text style={s.stepLabel}>{steps[wizard.step]}</Text>

      {/* Step 0: Details */}
      {wizard.step === 0 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>What's the{'\n'}event called?</Text>
          
          <Pressable onPress={pickImage} style={s.coverUpload}>
            {wizard.coverPhotoUri ? (
              <Image source={{ uri: wizard.coverPhotoUri }} style={s.coverImage} />
            ) : (
              <Text style={s.coverUploadText}>+ Add Cover Photo or Video</Text>
            )}
          </Pressable>

          <TextInput style={s.input} value={wizard.title} onChangeText={(t) => updateWizard({title:t})}
            placeholder="Summer Reunion 2026" placeholderTextColor={colors.ash} />
          <TextInput style={[s.input,{height:80}]} value={wizard.description} onChangeText={(t) => updateWizard({description:t})}
            placeholder="Optional description..." placeholderTextColor={colors.ash} multiline />
          <TextInput style={s.input} value={wizard.location} onChangeText={(t) => updateWizard({location:t})}
            placeholder="Location (optional)" placeholderTextColor={colors.ash} />
            
          <Pressable style={s.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{color: wizard.startsAt ? colors.cream : colors.ash}}>
              {wizard.startsAt ? new Date(wizard.startsAt).toLocaleString() : 'Select Event Date (Optional)'}
            </Text>
          </Pressable>
          
          {showDatePicker && (
            <DateTimePicker
              value={wizard.startsAt ? new Date(wizard.startsAt) : new Date()}
              mode="datetime"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) {
                  updateWizard({ startsAt: date.toISOString() });
                }
              }}
            />
          )}

          <Text style={[s.subLabel, { marginTop: 32 }]}>START FROM TEMPLATE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.templateScroll}>
            {TEMPLATES.map((tmpl) => (
              <Pressable 
                key={tmpl.name} 
                style={s.templateCard}
                onPress={() => updateWizard({
                  title: tmpl.name,
                  eventType: tmpl.type as any,
                  shotLimit: tmpl.shots,
                  cameraStyle: tmpl.camera as any,
                  revealMode: tmpl.reveal as any,
                })}
              >
                <Text style={s.templateName}>{tmpl.name}</Text>
                <Text style={s.templateMeta}>{tmpl.shots} shots · {tmpl.camera}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Step 1: Type */}
      {wizard.step === 1 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>What type{'\n'}of event?</Text>
          <View style={s.grid}>
            {EVENT_TYPES.map((t) => (
              <Pressable key={t} style={[s.optionChip, wizard.eventType===t && s.optionActive]}
                onPress={() => updateWizard({eventType: t as any})}>
                <Text style={[s.optionText, wizard.eventType===t && s.optionTextActive]}>
                  {t.replace('_',' ')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Step 2: Camera */}
      {wizard.step === 2 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>Choose your{'\n'}camera style</Text>
          <View style={s.grid}>
            {CAMERA_STYLES.map((c) => (
              <Pressable key={c} style={[s.optionChip, wizard.cameraStyle===c && s.optionActive]}
                onPress={() => updateWizard({cameraStyle: c as any})}>
                <Text style={[s.optionText, wizard.cameraStyle===c && s.optionTextActive]}>
                  {c.replace('_',' ')}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.subLabel}>SHOTS PER GUEST</Text>
          <View style={s.shotRow}>
            {[12,24,36].map((n) => (
              <Pressable key={n} style={[s.shotChip, wizard.shotLimit===n && s.shotActive]}
                onPress={() => updateWizard({shotLimit:n})}>
                <Text style={[s.shotText, wizard.shotLimit===n && s.shotTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Step 3: Reveal */}
      {wizard.step === 3 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>When should{'\n'}photos reveal?</Text>
          <View style={s.grid}>
            {REVEAL_MODES.map((r) => (
              <Pressable key={r} style={[s.optionChip, wizard.revealMode===r && s.optionActive]}
                onPress={() => updateWizard({revealMode: r as any})}>
                <Text style={[s.optionText, wizard.revealMode===r && s.optionTextActive]}>
                  {r.replace('_',' ')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Step 4: Privacy */}
      {wizard.step === 4 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>Who can{'\n'}see this?</Text>
          <View style={s.grid}>
            {['public', 'private', 'invite_only'].map((v) => (
              <Pressable key={v} style={[s.optionChip, wizard.visibility===v && s.optionActive]}
                onPress={() => updateWizard({visibility: v as any})}>
                <Text style={[s.optionText, wizard.visibility===v && s.optionTextActive]}>
                  {v.replace('_',' ')}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Step 5: Review */}
      {wizard.step === 5 && (
        <Animated.View entering={FadeInDown} style={s.stepContent}>
          <Text style={s.heading}>Ready to{'\n'}create?</Text>
          <View style={s.review}>
            <Text style={s.rvLabel}>Event</Text><Text style={s.rvVal}>{wizard.title}</Text>
            <Text style={s.rvLabel}>Type</Text><Text style={s.rvVal}>{wizard.eventType}</Text>
            <Text style={s.rvLabel}>Camera</Text><Text style={s.rvVal}>{wizard.cameraStyle}</Text>
            <Text style={s.rvLabel}>Shots</Text><Text style={s.rvVal}>{wizard.shotLimit}</Text>
            <Text style={s.rvLabel}>Reveal</Text><Text style={s.rvVal}>{wizard.revealMode}</Text>
            <Text style={s.rvLabel}>Visibility</Text><Text style={s.rvVal}>{wizard.visibility}</Text>
          </View>
        </Animated.View>
      )}

      {/* Navigation */}
      <View style={s.nav}>
        {wizard.step > 0 && (
          <Pressable style={s.backBtn} onPress={() => setWizardStep(wizard.step - 1)}>
            <Text style={s.backText}>Back</Text>
          </Pressable>
        )}
        <Pressable
          style={[s.nextBtn, submitting && {opacity:0.6}]}
          onPress={wizard.step === 5 ? () => handleCreate(false) : handleNext}
          disabled={submitting}
        >
          <Text style={s.nextText}>
            {wizard.step === 5 ? (submitting ? 'Creating...' : 'Create Event') : 'Next'}
          </Text>
        </Pressable>
      </View>

      {wizard.step === 5 && (
        <Animated.View entering={FadeInDown.delay(200)}>
          <Pressable 
            style={[s.draftBtn, submitting && {opacity:0.6}]} 
            onPress={() => handleCreate(true)}
            disabled={submitting}
          >
            <Text style={s.draftText}>Save as Draft</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void},
  scroll:{paddingHorizontal:24,paddingTop:70,paddingBottom:40},
  progress:{flexDirection:'row',gap:6,marginBottom:8},
  dot:{width:32,height:4,borderRadius:2,backgroundColor:colors.smoke},
  dotActive:{backgroundColor:colors.amber},
  stepLabel:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:2,color:colors.amber,marginBottom:24},
  stepContent:{marginBottom:32},
  heading:{fontFamily:fonts.display,fontSize:34,lineHeight:38,color:colors.cream,marginBottom:24,letterSpacing:-0.68},
  input:{backgroundColor:colors.charcoal,borderWidth:1,borderColor:colors.smoke,borderRadius:radius.md,paddingHorizontal:16,paddingVertical:14,fontFamily:fonts.body,fontSize:15,color:colors.cream,marginBottom:12},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  optionChip:{paddingHorizontal:16,paddingVertical:10,borderRadius:radius.pill,backgroundColor:colors.charcoal,borderWidth:1,borderColor:colors.smoke},
  optionActive:{backgroundColor:colors.amber+'20',borderColor:colors.amber},
  optionText:{fontFamily:fonts.bodyMedium,fontSize:13,color:colors.parchment,textTransform:'capitalize'},
  optionTextActive:{color:colors.amber},
  subLabel:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:2,color:colors.parchment,marginTop:24,marginBottom:12},
  shotRow:{flexDirection:'row',gap:12},
  shotChip:{width:64,height:64,borderRadius:radius.md,backgroundColor:colors.charcoal,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:colors.smoke},
  shotActive:{borderColor:colors.amber,backgroundColor:colors.amber+'15'},
  shotText:{fontFamily:fonts.mono,fontSize:24,color:colors.parchment},
  shotTextActive:{color:colors.amber},
  review:{gap:8},
  rvLabel:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:1.5,color:colors.parchment,marginTop:8},
  rvVal:{fontFamily:fonts.headingSemiBold,fontSize:18,color:colors.cream,textTransform:'capitalize'},
  nav:{flexDirection:'row',gap:12,marginTop:16},
  backBtn:{flex:1,height:52,borderRadius:radius.md,backgroundColor:colors.charcoal,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:colors.smoke},
  backText:{fontFamily:fonts.headingSemiBold,fontSize:15,color:colors.cream},
  nextBtn:{flex:2,height:52,borderRadius:radius.md,backgroundColor:colors.amber,justifyContent:'center',alignItems:'center'},
  nextText:{fontFamily:fonts.headingSemiBold,fontSize:15,color:colors.void},
  draftBtn:{height:52,borderRadius:radius.md,backgroundColor:'transparent',justifyContent:'center',alignItems:'center',marginTop:12,borderWidth:1,borderColor:colors.smoke},
  draftText:{fontFamily:fonts.headingSemiBold,fontSize:15,color:colors.parchment},
  coverUpload: { height: 160, backgroundColor: colors.charcoal, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.smoke, marginBottom: 12, borderStyle: 'dashed', overflow: 'hidden' },
  coverUploadText: { fontFamily: fonts.bodySemiBold, color: colors.amber, fontSize: 13 },
  coverImage: { width: '100%', height: '100%' },
  templateScroll: { marginHorizontal: -24, paddingHorizontal: 24, flexDirection: 'row' },
  templateCard: { backgroundColor: colors.charcoal, borderWidth: 1, borderColor: colors.smoke, borderRadius: radius.md, padding: 16, marginRight: 12, width: 160 },
  templateName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.cream, marginBottom: 4 },
  templateMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.ash, textTransform: 'capitalize' },
});
