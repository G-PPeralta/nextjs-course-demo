import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "@/components/meetups/MeetupDetail";
import Head from "next/head";

export default function MeetupDetailsPage(props) {

  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          description={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

// É necessária quando utiliza-se o getStaticProps
export async function getStaticPaths() {
  const client = await MongoClient.connect("mongodb+srv://pratesperalta:WYr6OSZJ7sM6aUxo@cluster0.z8q3s04.mongodb.net/meetups")

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({
      params: {
        meetupId: meetup._id.toString()
      }
    }))
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect("mongodb+srv://pratesperalta:WYr6OSZJ7sM6aUxo@cluster0.z8q3s04.mongodb.net/meetups")

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  }
}