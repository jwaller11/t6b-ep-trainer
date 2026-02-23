export const briefs = [

  {
    id: "fam_vnav_brief",
    type: "fam",
    title: "FAM/VNAV BRIEF",
    steps: [
      {
      type: "condition",
      text: "1. I.M.S.A.F.E. Checklist"
    },
    {
      type: "action",
      text: "\"I'm safe\""
    },

    {
      type: "condition",
      text: "3. Airsickness History"
    },
    {
      type: "action",
      text: "Aircrew must announce if they become passively or actively airsick and may pass the controls as the situation dictates. The flying pilot will keep the aircraft in a stable position, minimizing turns as the situation allows. If the airsick pilot feels he or she cannot continue, the mission will be aborted for airsickness."
    }

  ]
  },

  {
    id: "inav_brief",
    type: "inav",
    title: "INAV BRIEF",
    steps: [
      { type: "action", text: "1. Paragraph one verbatim text here." },
      { type: "action", text: "2. Paragraph two verbatim text here." }
    ]
  },

  {
    id: "forms_brief",
    type: "form",
    title: "FORMS BRIEF",
    steps: [
      { type: "action", text: "1. Paragraph one verbatim text here." },
      { type: "action", text: "2. Paragraph two verbatim text here." }
    ]
  }

];
