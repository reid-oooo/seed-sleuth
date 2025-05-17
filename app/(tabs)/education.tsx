import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Droplet, Beaker, FlaskConical, Palette, Clock, Leaf, Utensils, Factory, Coffee, Candy } from 'lucide-react-native';

import Colors from '@/constants/colors';
import InfoCard from '@/components/InfoCard';
import LogoHeader from '@/components/LogoHeader';

export default function EducationScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: "Learn About Ingredients",
        headerTitle: () => <LogoHeader />
      }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Food Processing Levels
        </Text>
        
        <InfoCard
          title="Unprocessed & Minimally Processed"
          content="These are natural foods with no added ingredients, or foods that have been slightly modified (cleaning, removing inedible parts, cooling, freezing, pasteurization) without adding new ingredients. Examples include fresh fruits, vegetables, nuts, meats, eggs, milk, and plain yogurt."
          icon={<Leaf size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Processed Culinary Ingredients"
          content="These are ingredients extracted from natural foods, such as oils, butter, sugar, and salt. They're meant to be used in cooking and food preparation, not consumed by themselves. Examples include olive oil, butter, honey, maple syrup, and salt."
          icon={<Utensils size={20} color={colors.neutral} />}
        />
        
        <InfoCard
          title="Processed Foods"
          content="These are relatively simple products made by adding sugar, oil, salt or other processed culinary ingredients to minimally processed foods. Examples include canned vegetables with salt, fruits in syrup, cheeses, freshly made bread, and canned fish."
          icon={<Factory size={20} color={colors.warning} />}
        />
        
        <InfoCard
          title="Ultra-Processed Foods"
          content="These are industrial formulations with five or more ingredients, typically including additives not used in home cooking. They often contain high amounts of sugar, oils, fats, salt, anti-oxidants, stabilizers, and preservatives. Examples include soft drinks, packaged snacks, reconstituted meat products, and pre-prepared frozen dishes."
          icon={<Beaker size={20} color={colors.danger} />}
        />
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Why Should You Care?
        </Text>
        
        <InfoCard
          title="Seed Oils"
          content="Seed oils are highly processed vegetable oils extracted from seeds like soybean, canola, corn, and cottonseed. They're high in omega-6 fatty acids which, when consumed in excess, may contribute to inflammation and oxidative stress. Many seed oils are also processed with chemical solvents like hexane and may contain residues."
          icon={<Droplet size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Thickening Agents"
          content="Thickeners are additives used to increase the viscosity of food products. While some are derived from natural sources, others are highly processed or synthetic. Some thickeners like carrageenan have been linked to digestive issues and inflammation in sensitive individuals."
          icon={<Beaker size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Emulsifiers"
          content="Emulsifiers help mix ingredients that would normally separate, like oil and water. Recent research suggests some synthetic emulsifiers may disrupt gut bacteria and potentially contribute to intestinal inflammation and metabolic disorders. They're commonly found in processed foods, dressings, and baked goods."
          icon={<FlaskConical size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Preservatives"
          content="Preservatives extend shelf life by preventing bacterial growth and oxidation. While some are necessary for food safety, many synthetic preservatives like BHA, BHT, and sodium nitrite have been linked to health concerns including cancer, hormone disruption, and allergic reactions. They're widespread in processed and packaged foods."
          icon={<Clock size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Petroleum-based Food Colors"
          content="Artificial food dyes like Red 40, Yellow 5, and Blue 1 are derived from petroleum (crude oil). These synthetic colors have been linked to behavioral problems in children, including hyperactivity and attention issues. Some may also contain carcinogenic contaminants and can trigger allergic reactions in sensitive individuals."
          icon={<Palette size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Natural Flavors & Maltodextrin"
          content="Despite the name, 'natural flavors' can contain dozens of chemicals and processing agents. Maltodextrin, often used in natural flavors, is a highly processed carbohydrate with an extremely high glycemic index (higher than table sugar), making it particularly problematic for people with diabetes or blood sugar issues."
          icon={<Coffee size={20} color={colors.primary} />}
        />
        
        <InfoCard
          title="Artificial Sweeteners"
          content="Artificial sweeteners like aspartame, sucralose, and acesulfame potassium are synthetic sugar substitutes that provide sweetness without calories. Despite being FDA-approved, studies suggest they may disrupt gut bacteria, alter glucose metabolism, and potentially contribute to metabolic disorders. Some have been linked to headaches, digestive issues, and other health concerns."
          icon={<Candy size={20} color={colors.primary} />}
        />
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Healthier Alternatives
        </Text>
        
        <InfoCard
          title="Better Oil Choices"
          content="Instead of processed seed oils, consider using extra virgin olive oil, avocado oil, or coconut oil. These oils are less processed, contain beneficial compounds, and have better fatty acid profiles. For high-heat cooking, avocado oil and coconut oil are more stable options."
          icon={<Droplet size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Natural Thickeners"
          content="Look for products using natural thickeners like arrowroot, tapioca starch, or gelatin. When making food at home, you can use chia seeds, flaxseeds, or psyllium husk as natural thickening agents that also provide fiber and nutrients."
          icon={<Beaker size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Natural Preservatives"
          content="Natural preservatives include vitamin E (tocopherols), rosemary extract, citric acid, and ascorbic acid (vitamin C). Fermentation, salt, sugar, and vinegar are traditional preservation methods that can also enhance flavor. These alternatives are generally safer than synthetic preservatives."
          icon={<Clock size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Natural Food Colors"
          content="Natural food colorings derived from fruits, vegetables, and spices are healthier alternatives to petroleum-based dyes. Look for colors from beet juice, turmeric, spirulina, paprika, or fruit and vegetable concentrates. These provide color without the potential health risks of synthetic dyes."
          icon={<Palette size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Real Flavors Instead of 'Natural Flavors'"
          content="Choose products that list actual ingredients like 'vanilla extract' or 'cinnamon' rather than the umbrella term 'natural flavors.' For sweeteners, opt for lower glycemic options like stevia, monk fruit, or small amounts of honey or maple syrup instead of products containing maltodextrin."
          icon={<Coffee size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Natural Sweeteners"
          content="Instead of artificial sweeteners, consider using small amounts of natural sweeteners like raw honey, pure maple syrup, dates, or coconut sugar. For zero-calorie options, stevia and monk fruit are plant-based alternatives with fewer concerns than synthetic sweeteners. Always moderate sweetener consumption regardless of source."
          icon={<Candy size={20} color={colors.safe} />}
        />
        
        <InfoCard
          title="Minimal Processing"
          content="The best approach is to choose minimally processed whole foods whenever possible. Fresh fruits, vegetables, meats, and whole grains naturally don't contain artificial additives. When buying packaged foods, look for short ingredient lists with recognizable ingredients."
          icon={<Leaf size={20} color={colors.safe} />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 16,
  },
});