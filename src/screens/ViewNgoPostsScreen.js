import React from 'react';
import { SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, ScrollView, View } from 'react-native';
import { Card } from 'react-native-paper';
import { theme } from "../core/theme";
import BackButton from "../components/BackButton";
export const ngoPostsData = [
    {
        id: 1,
        source: require('../../assets/items/food123.jpg'),
        title: 'Food Drive',
        description: 'Our recent food drive fed over 500 people in need.',
        fullDescription: 'Join the Fight Against Hunger in Kenya: A Community Food Drive Kenya is currently grappling with severe drought conditions, leaving countless families facing hunger and malnutrition. Crops have failed, livestock is dying, and water sources are drying up, causing widespread food insecurity. In these trying times, our community has the power to make a difference.An NGO in the region has launched a Food Drive Initiative aimed at providing immediate relief to those hardest hit by the drought. The program focuses on distributing essential food supplies, clean drinking water, and nutritional supplements to vulnerable communities, including children and the elderly. Beyond emergency aid, the NGO is working towards long-term solutions, such as drought-resistant farming programs and community water projects.  How You Can Help: Donate: Every contribution, big or small, helps buy food, water, and medical supplies for those in need Volunteer: Join our efforts to pack and distribute food or help spread awareness about the initiative.Raise Awareness: Share information about the drought and this food drive with your network to amplify the cause.Together, we can bring hope and relief to communities in Kenya facing these harsh conditions. Your support can turn hunger into hope and make a lasting impact. Let’s act now and be the change they desperately need.',
        donateUrl: 'https://alkhidmat.com/donate/dastarkhawan/',
    },
    {
        id: 2,
        source: require('../../assets/items/Unknown.jpg'),
        title: 'Education for All Campaign',
        description: 'Aims to provide essential educational materials and support to children in underserved communities.',
        fullDescription:
            'In the quiet corners of underserved communities, dreams flicker like candles, yearning for a spark to ignite their brilliance. Through our Education for All Campaign, we aim to nurture these dreams, transforming them into realities that light the path to a brighter future. With every book, pencil, and classroom we provide, we plant seeds of hope in the fertile minds of children longing to learn. Education is not just a tool—it is the key to unlocking doors of opportunity, breaking the chains of poverty, and lifting entire communities into the light. Your support fuels this journey, turning obstacles into stepping stones and challenges into triumphs. Together, we can deliver the gift of learning to children who have the potential to change the world. Join us in this mission to inspire, empower, and uplift, for every child deserves a chance to shine as brightly as the stars they dream of touching. Education is their right, and with your help, it can be their reality. Let us weave a tapestry of knowledge and hope that blankets the world in possibility.',
        style: {},
        donateUrl: 'https://www.tcf.org.pk/girls-education/?utm_source=Website&utm_medium=Donate_Button&utm_term=Donate_header&utm_content=Website_Pakistan&utm_campaign=Organic_Website_GirlEducation',


    },
    {
        id: 3,
        source: require('../../assets/items/This is our land, we’ll stay.png'),
        title: 'Support Gaza Relief Campaign',
        description: 'Providing essential aid to families affected by the crisis in Gaza.',
        fullDescription:
            'Our Gaza Relief Campaign is dedicated to providing comprehensive support to families affected by the ongoing crisis in Gaza. This includes delivering life-saving supplies such as food, clean water, medical aid, and hygiene kits to those in urgent need. Beyond immediate relief, we are also working to support the education of children by supplying books, school materials, and learning resources, ensuring they can continue their education despite the challenges they face. By contributing to this campaign, you are not only addressing critical needs but also helping to restore hope and dignity to the lives of countless individuals. Together, we can make a meaningful difference and stand in solidarity with the people of Gaza during these difficult times.',
        style: {},
        donateUrl:'https://bdsmovement.net/donate_',
    },
    {
        id: 4,
        source: require('../../assets/items/Kenyan Flood Victims Receive Emergency Assistance.png'),
        title: 'Flood Relief Drive – Urgent Appeal for Donations',
        description: 'Help us provide critical aid to families devastated by the recent floods.',
        fullDescription: 'The waters have risen, and with them, the hopes of countless families have been swept away. In the blink of an eye, homes were lost, livelihoods shattered, and futures uncertain. The floodwaters have turned vibrant communities into scenes of despair, leaving families with nothing but the clothes on their backs and the memories of what once was. Yet, even in the face of overwhelming loss, there is a flicker of hope that still burns bright—the hope that we, together, can rebuild what has been destroyed.Our Flood Relief Drive is an urgent call to action, a plea for compassion in a time of unimaginable need. We are committed to bringing essential aid to the heart of the affected areas—food, clean drinking water, medical supplies, and hygiene kits are desperately needed by those whose lives have been upended. Your donation, no matter how small, will carry with it the promise of survival and the possibility of renewal.But this is more than just an appeal for material goods—it is a call to restore dignity, to remind those who have lost so much that they are not forgotten.With your help, we will not only provide immediate relief but also offer the chance for these families to rebuild their homes, their schools, and their lives.How You Can Help: Donate: Your generosity can turn despair into hope.Every dollar you contribute will go directly to providing food, water, and shelter to those in need.Share: Raise awareness by sharing this message, so that we can extend our reach and multiply the impact of every donation.Together, we can stand strong in the face of devastation and prove that compassion knows no bounds.Let’s rebuild hope from the rubble and restore the dreams of those whose futures have been drowned by the floodwaters.',
        style: {},
        donateUrl:'https://www.embracerelief.org/donation/kenya-flood-relief',
    },
    {
        id: 5,
        source: require('../../assets/items/Influencer Elena Huelva, 20, dies after bidding fans heart-rending farewell.png'),
        title: 'Cancer Support Drive – Join the Fight Against Cancer',
        description: 'Together, we can help provide critical care and support for cancer patients.',
        fullDescription: 'Cancer touches the lives of millions, leaving families and communities devastated in its wake. For those battling this cruel disease, every moment is a challenge, and every day is uncertain. The physical, emotional, and financial toll can be overwhelming, but there is hope. Hope through research, hope through treatment, and hope through the support of compassionate people like you. We are reaching out to you to join our Cancer Support Drive—an initiative dedicated to helping those fighting cancer access the care, treatment, and emotional support they need. This program provides critical medical expenses, chemotherapy treatments, pain management, and financial aid to cancer patients and their families who cannot afford the costs. Your donation can make a difference—whether it’s helping to fund life-saving treatments, supporting clinical trials, or offering resources to patients who need emotional and psychological care during their journey. Cancer is a battle, but it’s one that can be fought with the right support, the right treatment, and the right resources. How You Can Help: Donate: Your contribution, no matter how big or small, can help fund cancer treatments, provide financial support to families, and further vital research. Volunteer: Share your time and expertise by assisting in awareness campaigns, fundraising events, or offering support to families affected by cancer. Raise Awareness: Spread the word about this campaign to inspire others to donate and help us reach those in need. Together, we can create a community of care and compassion. Let’s stand united against cancer and ensure that no one has to face this fight alone. Your support can give cancer patients the strength to continue their battle and the hope that a cure is within reach. Join us today, and together we can make a difference.',
        style: {},
        donateUrl:'https://donate.cancer.org/?campaign=default&lang=en',

    },
    {
        id: 6,
        source: require('../../assets/items/Lost Souls_ Candid Street Portraits by GianStefano Fontana - The Photo Argus.png'),
        title: 'Support Our Elders – Old Home Donation Drive',
        description: 'Help us provide care, comfort, and companionship to our elderly community.',
        fullDescription: 'Every wrinkle tells a story, every smile holds wisdom, and every elder deserves dignity and respect. Yet, many elderly individuals live in isolation, struggling with the challenges of aging, health issues, and financial hardships. Our Old Home Donation Drive aims to bring light into their lives by providing essential resources, medical care, and companionship. Your donations will go toward improving living conditions, providing nutritious meals, access to medical services, and organizing activities that promote mental well-being and community engagement for the elderly. These funds also help renovate old homes, ensuring that our elders live in safe, clean, and comfortable environments. How You Can Help: Donate: Your contribution can directly improve the quality of life for elderly individuals, providing them with the resources they need to live with dignity and comfort. Volunteer: Spend time with the elderly, share stories, or assist in organizing events to bring joy and companionship to their lives. Raise Awareness: Share our mission with your friends and family to inspire more support for our elderly community. Together, we can honor their wisdom and show them that they are not forgotten. Join us in making their golden years truly golden by supporting this campaign today. Every act of kindness counts, and together, we can make a meaningful difference.',
        style: {},
        donateUrl:'https://almustafa.pk/donation/sponsor-a-senior-citizen/',

    },
];

const NgoPost = ({post, navigation}) => {
    return (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('NgoPostDetailsScreen', {
                    title: post.title,
                    description: post.fullDescription,
                    image: post.source,
                    donateUrl: post.donateUrl,
                })
            }
        >

        </TouchableOpacity>
    );
};



export default function ViewNgoPostsScreen({ navigation }) {
    console.log("NGO Posts Data:", ngoPostsData.map(post => ({ id: post.id, donateUrl: post.donateUrl })));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backButtonWrapper}>
                <BackButton goBack={navigation.goBack} />
            </View>
            <ScrollView>
                {ngoPostsData.map((post) => (
                    <View key={post.id} style={styles.cardContainer}>
                        <TouchableOpacity
                        
                            onPress={() =>
                                navigation.navigate('NgoPostDetailsScreen', {
                                    title: post.title,
                                    description: post.fullDescription,
                                    image: post.source,
                                    donateUrl: post.donateUrl,
                                })
                            }
                        >
                            <Card style={styles.card}>
                                <Image source={post.source} style={[styles.image, post.style]} />
                                <Text style={styles.title}>{post.title}</Text>
                                <Text style={styles.description}>{post.description}</Text>
                            </Card>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.TaupeBlack,
        padding: 30,

    },
    cardContainer: {
        marginBottom: 16,
        backgroundColor: theme.colors.sageGreen,
        borderRadius: 10,
    },
    card: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.sageGreen,
        overflow: 'hidden',
    },
    image: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 1,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        textAlign: 'center',
        padding: 10,
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 0, 
        left: 6, 
        padding: 10, 
        zIndex: 100,
      },
});

