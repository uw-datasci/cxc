/** A piece of an answer: plain text, or a link. */
export type FaqAnswerPart = string | { text: string; href: string };

/** An answer is plain text, or a list of parts when it contains links. */
export type FaqAnswer = string | readonly FaqAnswerPart[];

export interface FaqItem {
  id: string;
  question: string;
  answer: FaqAnswer;
}

/** FAQ content, in display order. Use a parts array for answers that contain links. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "1",
    question: "What is CxC?",
    answer: `CxC is Waterloo's Largest AI Hackathon returning for its 5th iteration this year! Over 300 students gather at Waterloo's campus to create unique and inspiring designs that tackle data-related challenges. 
    This year, CxC will have no restrictions on the type of project you can make. Some past examples of projects include predictions/classifications of datasets, training AI models, or making a data science related website. 
    We will also be hosting social activities, introductory workshops, company booths, and more to help you connect with other participants, industry experts, and learn more about data science.`,
  },
  {
    id: "2",
    question: "What if I have zero experience in data science?",
    answer: `No worries! CxC is a beginner-friendly hackathon. We will host several workshops throughout the event to help you acquire some useful skills for the challenges. We will also have a team of experienced mentors ready to provide support on the CxC Discord.`,
  },
  {
    id: "3",
    question: "How much does it cost?",
    answer:
      "Nothing! Our sponsors allow us to give prizes, merch, meals, snacks, and more - all free of charge!",
  },
  {
    id: "4",
    question: "When and where is it?",
    answer: `CxC will take place on February 5-7 at the University of Waterloo.`,
  },
  {
    id: "5",
    question: "How many people are allowed in a team?",
    answer: `Teams can have between 1-4 people. You can find teammates through our Discord introductions channel or in-person during the opening ceremony.`,
  },
  {
    id: "6",
    question: "Do I need to be a UW student to participate?",
    answer: `No! We are open to ALL students from ALL universities. We will unfortunately not admit any high school students this year.`,
  },
  {
    id: "7",
    question: "Am I required to attend in-person?",
    answer: `We required all participants to check-in in-person on the evening of February 6th at the University of Waterloo. Workshops will not be recorded or streamed online. Pitching on February 8th will be done in person. Overnight stay at the venue is allowed. Unfortunately we cannot provide travel reimbursements.`,
  },
  {
    id: "8",
    question: "What events will you have at CxC?",
    answer: `In the past, CxC hosted multiple data science related workshops from simpler topics such as introducing machine learning and data processing with python, to more advanced topics such as planning and structural AI projects. Our event sponsors will also be running booths where you can learn their mission and connect with them throughout the day. Be sure to check them out!
    In addition, CxC will also be running multiple fun activities throughout the event, from spicy noodle challenge to late-night karaoke. We're confident that our events will be enough for anyone to enjoy :)`,
  },
  {
    id: "9",
    question: "What is the MLH Code of Conduct?",
    answer: [
      "CxC follows the Major League Hacking (MLH) Code of Conduct. All participants are expected to treat others with respect and create a welcoming, inclusive environment. Harassment or discrimination of any kind will not be tolerated. You can read the full ",
      {
        text: "Code of Conduct",
        href: "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
      },
      ".",
    ],
  },
];
