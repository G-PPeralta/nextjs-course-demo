import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "@/components/meetups/MeetupList";

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

// Por default, o Next monta a página estática e fornece para o navegador
// Contudo, se a página necessitar de dados dinâmicos, ou seja, de um servidor, é possível utilizar o getStaticProps, que irá ser executado antes da página ser montada e fornece os dados para a página

export async function getStaticProps() {
  const client = await MongoClient.connect("mongodb+srv://pratesperalta:WYr6OSZJ7sM6aUxo@cluster0.z8q3s04.mongodb.net/meetups")

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      })),
    },
    revalidate: 100 // Tempo em segundos para a página ser revalidada. Ou seja, a página é gerada novamente no servidor e o navegador recebe a nova versão, porém apenas se o usuário acessar a página novamente
  }
}


// O getServerSideProps é executado em cada requisição, ou seja, a página é montada no servidor e o navegador recebe a página montada
// Vale a pena usar quando a página necessita de dados dinâmicos que não podem ser gerados no build time, ou seja, dados que mudam com frequência

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }
// }