/**
 * ============================================================
 * MYSTIQUE COMPASS - CHEIRO PSYCHIC NUMBERS MODULE
 * ============================================================
 * Source: Cheiro's Book of Numbers (Count Louis Hamon)
 * Extracted: Letter-for-letter from original text
 * ============================================================
 */

export interface CheiroPsychicData {
  title: string;
  planet: string;
  birthDates: string[];
  strongPeriods: string[];
  description: string;
  luckyDays: {
    primary: string[];
    fullDescription: string;
  };
  luckyColors: string;
  luckyJewels: string;
  compatibleNumbers: number[];
}

export const cheiroPsychicNumbers: Record<number, CheiroPsychicData> = {
  1: {
    title: "THE NUMBER 1",
    planet: "The Sun",
    birthDates: ["1st", "10th", "19th", "28th"],
    strongPeriods: [
      "21st July to 28th August (House of the Sun)",
      "21st March to 28th April (Vernal Equinox)"
    ],
    description: `The number 1 stands in this symbolism for the Sun. It is the beginning-that by which all the rest of the nine numbers were created. The basis of all numbers is one-the basis of all life is one. This number represents all that is creative, individual, and positive. Without going into further details, a person born under the Birth number of 1, or any of its series, has the underlying principles of being in his or her work creative, inventive, strongly individual, definite in his or her views, and in consequence more or less obstinate and determined in all they as individuals undertake. This relates to all men and women born under the number 1, such as on the 1st, 10th, 19th, or 28th of any month (the addition of all these numbers making a 1), but more especially so if they happen to be born between the 21st July and the 28th August, which is the period of the Zodiac called the "House of the Sun," or from the 21st March to the 28th April, when the Sun enters the Vernal Equinox and is considered elevated or all-powerful during this period. It is for this reason, which you will observe has a logical basis that, people born under the number 1 in these particular periods must have the qualities that I have given to all number 1 people in a distinctly more marked degree.

Number 1 people are ambitious; they dislike restraint, they always rise in whatever their profession or occupation may be. They desire to become the heads of whatever their businesses are, and as departmental chiefs they keep their authority and make themselves respected and "looked up to" by their subordinates.

These number 1 people should endeavor to carry out their most important plans and ideas on all days that vibrate to their own number, such as on the 1st, 10th, 19th, or 28th of any month, but especially in those periods, I have described before, namely, from the 21st July to the 28th August, and from the 21st March to the 28th April. Outside of their own numbers, number 1 people get on well with persons born under the 2, 4, and 7, such as those born on the 2nd, 4th, 7th, 11th, 13th, 16th, 20th, 22nd, 25th, 29th, and 31st, especially those born in the strong periods indicated.`,
    luckyDays: {
      primary: ["Sunday", "Monday"],
      fullDescription: `The days of the week most fortunate for number 1 persons are Sunday and Monday, and especially so if one of their "own numbers" should also fall on that day, such as the 1st, 10th, 19th, or 28th, and next to that their interchangeable numbers of 2, 4, 7, such as the 2nd, 4th, 7th, 11th, 13th, 16th, 20th, 22nd, 25th, 29th or 31st.`
    },
    luckyColors: "All shades of gold, yellows and bronze to golden brown",
    luckyJewels: "Topaz, amber, yellow diamond and all stones of these colors. If possible, they should wear a piece of amber next their flesh.",
    compatibleNumbers: [2, 4, 7]
  },
  2: {
    title: "THE NUMBER 2",
    planet: "The Moon",
    birthDates: ["2nd", "11th", "20th", "29th"],
    strongPeriods: [
      "20th June to 27th July (House of the Moon)"
    ],
    description: `The number 2 stands in symbolism for the Moon. It has the feminine attributes of the Sun, and, for this reason alone, although number 1 and number 2 people are decidedly opposite in their characters, their vibrations are harmonious and they make good combinations.

Number 2 persons are gentle by nature, imaginative, artistic, and romantic. Like the number 1 people, they are also inventive, but they are not as forceful in carrying out their ideas. Their qualities are more on the mental than the physical plane and they are seldom as strong physically as those born under the number 1.

Number 2 people are all those who are born on the 2nd, 11th, 20th, or 29th in any month, but their characteristics are the more marked if they are born between the 20th June and the 27th July, this period being what is called the "House of the Moon" I have added the seven days of the "Cusp" to the 20th.

Number 2 persons and number 1 vibrate together, and in a lesser degree with number 7 people, such as those born on the 7th, 16th, or 25th in any month.

Number 2 persons should endeavor to carry out their chief plans and ideas on days whose numbers vibrate with their own, such as on the 2nd, 11th, 20th, or 29th of any month, but more especially during the period of the 20th June to the 27th July.

The chief faults they should guard against are-being restless and unsettled, lack of continuity in their plans and ideas, and lack of self-confidence. They are also inclined to be oversensitive, and too easily get despondent and melancholy if they are not in happy surroundings.`,
    luckyDays: {
      primary: ["Sunday", "Monday", "Friday"],
      fullDescription: `The days of the week more fortunate or "lucky" for them are Sunday, Monday, and Friday (the reason Friday is favorable in this case is that it is governed by Venus), and especially so if, like the number 1 people, one of their own numbers should fall on either of these days, such as the 2nd, 11th, 20th, or 29th, and next to these their interchangeable numbers of 1, 4, 7, such as the 1st, 4th, 7th, 10th, 13th, 16th, 19th, 22nd, 25th, 28th, or 31st.`
    },
    luckyColors: "All shades of green, from the darkest to the lightest, also cream and white",
    luckyJewels: "Pearls, moonstones, pale green stones, and they should carry a piece of jade always with them, and, if possible, next their flesh.",
    compatibleNumbers: [1, 4, 7]
  },
  3: {
    title: "THE NUMBER 3",
    planet: "Jupiter",
    birthDates: ["3rd", "12th", "21st", "30th"],
    strongPeriods: [
      "19th February to March 20th-27th",
      "21st November to December 20th-27th"
    ],
    description: `The number 3 stands in symbolism for the Planet Jupiter, a planet, which plays a most important role both in Astrology and in all systems of Numerology. It is the beginning of what may be termed one of the main lines of force that runs right through all the numbers from 3 to 9.

It has a special relation to every third in the series, such as 3, 6, 9, and all their additions. These numbers added together in any direction produce a 9 as their final digit, and the 3, 6, 9, people are all sympathetic to one another.

Persons having a 3 for their Birth number are all those who are born on the 3rd, 12th, 21st, or 30th in any month, but the number 3 has still more significance if they should be born in what is called the "period of the 3," from the 19th February to March 20th-27th, or from the 21st November to December 20th-27th.

Number 3 people, like the number 1 individuals, are decidedly ambitious. They are never satisfied by being in subordinate positions. Their aim is to rise in the world, to have control and authority over others. They are excellent in the execution of commands; they love order and discipline in all things; they readily obey orders themselves, but they also insist on having their orders obeyed.

Number 3 people often rise to the very highest positions in any business, profession or sphere in which they may be found. They often excel in positions of authority in the army and navy, in government, and in life generally; and especially in all posts of trust and responsibility, as they are extremely conscientious in carrying out their duties.

Their faults are that they are inclined to be dictatorial, to "lay down the law" and to insist on carrying out their own ideas. For this reason, although they are not quarrelsome, they succeed in making many enemies.

Number 3 people are singularly proud; they dislike being under an obligation to others; they are also exceptionally independent, and chafe under the least restraint.`,
    luckyDays: {
      primary: ["Thursday", "Friday", "Tuesday"],
      fullDescription: `Number 3 people should endeavor to carry out their plans and aims on all days that vibrate to their own number, such as on the 3rd, 12th, 21st, and 30th of any month, but more especially when these dates fall in the "period of the 3," such as from the 19th February to March 20th-27th, and from the 21st November to December 20th-27th.

The days of the week more "lucky" for them are Thursday, Friday, and Tuesday; Thursday being the most important. These days are especially good if a number making a 3 should fall on it, such as the 3rd, 12th, 21st, or 30th, and next in order their interchangeable numbers of 6 and 9 such as the 6th, 9th, 15th, 18th, 24th, or 27th.

Number 3 people are more in harmony with those born under their own number or under the 6 and 9, such as all those who are born on a 3rd, 12th, 21st, 30th. 6th, 15th, 24th. 9th, 18th, 27th.`
    },
    luckyColors: "Some shade of mauve, violet, or purple, or some touch of these colors should always be with them; also in the rooms in which they live. All shades of blue, crimson, and rose are also favorable to them, but more as secondary colors.",
    luckyJewels: "The amethyst. They should always have one on their persons, and, if possible, wear it next their flesh.",
    compatibleNumbers: [6, 9]
  },
  4: {
    title: "THE NUMBER 4",
    planet: "Uranus",
    birthDates: ["4th", "13th", "22nd", "31st"],
    strongPeriods: [
      "21st June to July 20th-27th (Moon period)",
      "22nd July to end of August (Sun period)"
    ],
    description: `The number 4 stands in its symbolism for the Planet Uranus. It is considered related to the Sun, number 1, and in occultism is written as 4-1. Number 4 people have a distinct character of their own. They appear to view everything from an opposite angle to everyone else. In an argument they will always take the opposite side, and although not meaning to be quarrelsome, yet they bring about opposition and make a great number of secret enemies who constantly work against them.

They seem quite naturally to take a different view of any thing that is presented to their minds. They instinctively rebel against rules and regulations, and if they can have their way, they reverse the order of things, even in communities and governments. They often rebel against constitutional authority and set up new rules and regulations either in domestic or public life. They are inclined to be attracted to social questions and reforms of all kinds, and are very positive and unconventional in their views and opinions.

Number 4 people are all those who are born on the 4th, 13th, 22nd, and 31st in any month; their individuality is still more pronounced of they are born in the Zodiacal period of the Sun and Moon, namely, between the 21st June and July 20th-27th (Moon period) and from the 21st July to the end of August (Sun period).

Number 4 people do not make friends easily. They seem more attracted to persons born under the 1, 2, 7 and 8.

They are seldom as successful in worldly or material matters as people born under the other numbers, and as a rule they are more or less indifferent as to the accumulation of wealth. If they do acquire money or have it given to them they generally surprise people by the way they employ it or the use they put it to.

They should endeavor to carry out their plans and ideas on all days that have their number 4, such as the 4th, 13th, 22nd, and 31st of any month, but especially so if these dates come in their strong period, from the 21st June to July 20th-27th, or from the 22nd July to the end of August.

Their chief faults are that they are most highly strung and sensitive, very easily wounded in their feelings, inclined to feel lonely and isolated, and are likely to become despondent and melancholy unless they have achieved success. As a rule they make few real friends, but to the few they have, they are most devoted and loyal, but are always inclined to take the part of "the under-dog" in any argument or any cause they espouse.`,
    luckyDays: {
      primary: ["Saturday", "Sunday", "Monday"],
      fullDescription: `The days of the week more fortunate or "lucky" for them are Saturday, Sunday, and Monday, especially so if their "own number" should fall on one of these days, such as the 4th, 13th, 22nd, or 31st, and next in order their interchangeable numbers of 1, 2, 7, such as the 1st, 2nd, 7th, 10th, 11th, 16th, 19th, 20th, 25th, 28th, or 29th.`
    },
    luckyColors: "What are called \"half-shades,\" \"half-tones,\" or \"electric colors.\" \"Electric blues\" and \"greys\" seem to suit them best of all.",
    luckyJewels: "The sapphire, light or dark, and if possible they should wear this stones next their flesh.",
    compatibleNumbers: [1, 2, 7, 8]
  },
  5: {
    title: "THE NUMBER 5",
    planet: "Mercury",
    birthDates: ["5th", "14th", "23rd"],
    strongPeriods: [
      "21st May to June 20th-27th",
      "21st August to September 20th-27th"
    ],
    description: `The number 5 stands in symbolism for the Planet Mercury, and is versatile and mercurial in all its characteristics. Number 5 people are all those who are born on the 5th, 14th, and 23rd in any month, but their characteristics are still more marked if they are born in what is called the "period of the 5," which is from the 21st May to June 20th-27th, and from the 21st August to September 20th-27th.

Number 5 people make friends easily and get on with persons born under almost any other number, but their best friends are those who are born under their own number, such as the 5th, 14th, and 23rd of any month.

Number 5 people are mentally very highly strung. They live on their nerves and appear to crave excitement.

They are quick in thought and decisions, and impulsive in their actions. They detest any plodding kind of work and seem naturally to drift into all methods of making money quickly. They have a keen sense of making money by inventions and new ideas. They are born speculators, prone to Stock Exchange transactions, and generally are willing and ready to run risks in all they undertake.

They have the most wonderful elasticity of character. They rebound quickly from the heaviest blow; nothing seems to affect them for very long; like their symbol, quicksilver, which Mercury represents, the blows of Fate leave no indentations on their character. If they are by nature good they remain so; if bad, not all the preaching in the world will make the slightest effect on them.

Number 5 people should endeavor to carry out their plans and aims on all days that fall under their "own number," such as the 5th, 14th, or 23rd of any month, but more especially when these dates fall in the "period of the 5," namely from the 21st May to June 20th-27th, or from the 21st August to September 20th-27th.

Their greatest drawback is that they exhaust their nervous strength to such an extent that they often fall victims to nervous breakdowns of the worst kind, and under any mental tension they easily become irritable and quick-tempered, unable to "suffer fools gladly."`,
    luckyDays: {
      primary: ["Wednesday", "Friday"],
      fullDescription: `The days of the week more fortunate or "lucky" for them are Wednesday and Friday, especially if their "own number" falls on one of these days.`
    },
    luckyColors: "All shades of light Grey, white and glistening materials, but just as they can make friends with people born under all kinds of numbers, so can they wear all shades of colors, but by far the best for them are light shades, and they should wear dark colors as rarely as possible.",
    luckyJewels: "The diamond, and all glittering or shimmering things; also ornaments made of platinum or silver, and, if possible, they should wear a diamond set in platinum next their flesh.",
    compatibleNumbers: [5]
  },
  6: {
    title: "THE NUMBER 6",
    planet: "Venus",
    birthDates: ["6th", "15th", "24th"],
    strongPeriods: [
      "20th April to May 20th-27th",
      "21st September to October 20th-27th"
    ],
    description: `The number 6 stands in symbolism for the Planet Venus. Persons having a 6 as their Birth number are all those who are born on the 6th, 15th, or 24th of any month, but they are more especially influenced by this number if they are born in what is called the "House of the 6th," which is from the 20th April to May 20th-27th, and from the 21st September to October 20th-27th.

As a rule all number 6 people are extremely magnetic; they attract others to them, and they are loved and often worshipped by those under them. They are very determined in carrying out their plans, and may, in fact, be deemed obstinate and unyielding, except when they themselves become deeply attached: in such a case they become devoted slaves to those they love.

Although number 6 people are considered influenced by the Planet Venus, yet as a rule theirs is more the "mother love" than the sensual. They lean to the romantic and ideal in all matters of the affections. In some ways they take very strongly after the supposed qualities of Venus, in that they love beautiful things, they make most artistic homes, are fond of rich colors, also paintings, statuary, and music.

If rich, they are most generous to art and artists, they love to entertain their friends and make everyone happy about them, but the one thing they cannot stand is discord and jealousy.

When roused by anger, they will brook no opposition, and will fight to the death for whatever person or cause they espouse, or out of their sense of justice.

The number 6 people have got the power making more friends than any other class, with the exception of the number 5, but especially so with all persons born under the vibration of the 3, the 6, the 9, or all their additions.

Number 6 people should endeavor to carry out their plans and aims on all dates that fall under their "own number," such as the 6th, 15th, or 24th of any month, but more especially when these dates fall in the "period of the 6," namely, between the 20th April and May 20th-27th, or from the 21st September to October 20th-27th.`,
    luckyDays: {
      primary: ["Tuesday", "Thursday", "Friday"],
      fullDescription: `Their most important days in the week are Tuesdays, Thursdays, and Fridays, and especially so if a number of 3, 6, or 9, such as the 3rd 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th, or 30th, should fall on one of those days.`
    },
    luckyColors: "All shades of blue, from the lightest to the darkest, also all shades of rose or pink, but they should avoid wearing black or dark colors.",
    luckyJewels: "Especially the turquoise, and, as far as possible, they should wear one, or a piece of turquoise matrix, next their skin. Emeralds are also \"lucky\" for the number 6.",
    compatibleNumbers: [3, 9]
  },
  7: {
    title: "THE NUMBER 7",
    planet: "Neptune",
    birthDates: ["7th", "16th", "25th"],
    strongPeriods: [
      "21st June to July 20th-27th (House of the Moon)"
    ],
    description: `The number 7 stands in symbolism for the Planet Neptune, and represents all persons born under the 7, namely those who are born on the 7th, 16th, or 25th of any month, but more especially influences such persons if they were born from the 21st June to July 20th-27th, the period of the Zodiac called the "House of the Moon." The Planet Neptune has always been considered as associated with the Moon, and, as the part of the Zodiac I have mentioned is also called the First House of Water, the connection of Neptune whose very name is always associated with Water is then logical and easily understood.

Now, as the number of the Moon is always given as a 2, this explains why it is that the number 7 people have as their secondary number the 2, and get on well and make friends easily with all those born under the Moon numbers, namely, the 2nd, 11th, 20th, and 29th of any month, especially so if they are also born in the "House of the Moon," from the 21st of June to the end of July.

People born under the number 7, namely, on the 7th, 16th, or 25th of any month, are very independent, original, and have strongly marked individuality.

At heart they love change and travel, being restless in their natures. If they have the means of gratifying their desires they visit foreign countries and become keenly interested in the affairs of far-off lands. They devour books on travel and have a wide universal knowledge of the world at large.

They often make extremely good writers, painters, or poets, but in everything they do, they sooner or later show a peculiar philosophical outlook on life that tinges all their work.

As a class they care little about the material things of life; they often become rich by their original ideas or methods of business, but if they do, they are just as likely to make large donations from their wealth to charities or institutions. The women of this number generally marry well, as they are always anxious about the future, and feel that they need some rock to rest on, lest the waters of Fate sweep them away.

The number 7 people have good ideas about business or rather their plans are good if they will only carry them out. They have usually a keen desire to travel and read a great deal about far-off countries. If they can, they will become interested in matters concerning the sea, and in trade or business they often become merchants, exporters and importers, dealing with foreign countries and owners or captains of ship, if they can get the opportunity.

Number 7 people have very peculiar ideas about religion. They dislike to follow the beaten track; they create a religion of their own, but one that appeals to the imagination and based on the occult.

These people usually have remarkable dreams and a great leaning to occultism; they have the gift of intuition, clairvoyance, and a peculiar quieting magnetism of their own that has great influence over others.`,
    luckyDays: {
      primary: ["Sunday", "Monday"],
      fullDescription: `The days of the week more fortunate or "lucky" for them are the same as for the number 2 people, namely, Sunday and Monday, especially if their "own number" falls on one of these days, or their interchangeable numbers of 1, 2, 4, such as the 1st, 2nd, 4th, 10th, 11th, 13th, 19th, 20th, 22nd, 28th, 29th, or 31st.`
    },
    luckyColors: "All shades of green, pale shades, also white and yellow, and they should avoid all heavy dark colors as much as possible.",
    luckyJewels: "Moonstones, \"cat's-eyes,\" and pearls, and if possible, they should wear a moonstone or a piece of moss agate next their flesh.",
    compatibleNumbers: [1, 2, 4]
  },
  8: {
    title: "THE NUMBER 8",
    planet: "Saturn",
    birthDates: ["8th", "17th", "26th"],
    strongPeriods: [
      "21st December to 26th January (House of Saturn Positive)",
      "26th January to February 19th-26th (House of Saturn Negative)"
    ],
    description: `The number 8 stands in symbolism for the Planet Saturn. This number influences all persons born on the 8th, 17th, or 26th, in any month, but still more so if their birthday comes between the 21st December and the 26th January, which period is called the House of Saturn (Positive), and from the 26th January to February 19th-26th, the period called the House of Saturn (Negative).

These people are invariably much misunderstood in their lives, and perhaps for this reason they feel intensely lonely at heart.

They have deep and very intense natures, great strength of individuality; they generally play some important role on life's stage, but usually one, which is fatalistic, or as the instrument of Fate for others.

If at all religious, they go to extremes and are fanatics in their zeal. In any cause they take up, they attempt to carry it through in spite of all argument or opposition, and in doing so they generally make bitter and relentless enemies.

They often appear cold and undemonstrative, though in reality they have warm hearts towards the oppressed of all classes; but they hide their feelings and allow people to think just what they please.

These number 8 people are either great successes or great failures; there appears to be no happy medium in their careers.

If ambitious; they generally aim for public life or government responsibility of some kind, and often hold very high positions involving great sacrifice on their part.

It is not, however, from a worldly standpoint, a fortunate number to be born under, and such persons often are called on to face the very greatest sorrows, losses, and humiliations.

The number 8 being a Saturn number, Saturday is therefore their most important day, but on account of the number 4 having influence on a Sunday and in a secondary way on a Monday, the number 8 people will find Saturday, Sunday, and Monday their most important days.

Number 8 people should endeavor to carry out their plans and aims on all days that fall under their "own number," such as the 8th, 17th, or 26th in any month, but more especially so when these dates fall in the "period of the 8," namely, from the 21st December to January 20th-27th, and from that date to February 19th-26th; also if these dates fall on a Saturday, Sunday, or Monday, or their interchangeable number, which is 4 such as the 4th, 13th, 22nd, or 31st.

The number 8 is a difficult number to explain. It represents two worlds, the material and the spiritual. It is in fact, if one regards it, like two circles just touching one another.

It is composed of two equal numbers 4 and 4.

From the earliest ages it has been associated with the symbol of an irrevocable Fate, both in connection with the lives of individuals or nations. In Astrology it stands for Saturn, which is also called the Planet of Fate.

One side of the nature of this number represents upheaval, revolution, anarchy, waywardness and eccentricities of all kinds.

The other side represents philosophic thought, a strong leaning towards occult studies, religious devotion, concentration of purpose, zeal for any cause espoused and a fatalistic outlook coloring all.

All persons who have the number 8 clearly associated with their lives feel that they are distinct and different from their fellows. At heart they are lonely; they are misunderstood, and they seldom reap the reward for the good they may do while they are living. After their death they are often extolled, their works praised, and lasting tributes offered to their memory.

Those on the lower plane generally come into conflict with human justice and have some tragic ending to their lives. Those on the higher plane carry their misunderstood motives and lay bare the tragedy of their souls before Divine Justice.

To distinguish in which of these two classes a number 8 person falls, one must find by the comparison of their "fadic" numbers if they are completely dominated by the recurrence of 8 in the principal events of their lives, or if some other equally powerful numbers such as the 1, 3 or 6 series does not more or less balance the sequel of events registered under the 8 and all its series.

If the latter is the case, one may be sure that by the long series of reincarnations they have passed through, they have paid the price in some former state, and are now passing towards the higher, where Divine Justice will give them their reward.

If, on the contrary, we find that the person is completely dominated by the number 8, always recurring in important events, or if instead of 8 the nearly equally fatalistic number of 4 is continually recurring, we may then be sure that we are in the presence of one those strange playthings of Fate with the possibilities that tragedy may be interwoven in their lives.`,
    luckyDays: {
      primary: ["Saturday", "Sunday", "Monday"],
      fullDescription: `The number 8 being a Saturn number, Saturday is therefore their most important day, but on account of the number 4 having influence on a Sunday and in a secondary way on a Monday, the number 8 people will find Saturday, Sunday, and Monday their most important days.

Number 8 people should endeavor to carry out their plans and aims on all days that fall under their "own number," such as the 8th, 17th, or 26th in any month, but more especially so when these dates fall in the "period of the 8," namely, from the 21st December to January 20th-27th, and from that date to February 19th-26th; also if these dates fall on a Saturday, Sunday, or Monday, or their interchangeable number, which is 4 such as the 4th, 13th, 22nd, or 31st.`
    },
    luckyColors: "All shades of dark Grey, black, dark blue, and purple. If number 8 persons were to dress in light colors they would look awkward, and as if there were something wrong with them.",
    luckyJewels: "The amethyst and the dark-toned sapphire, also the black pearl or the black diamond and if possible they should wear one of these next their flesh.",
    compatibleNumbers: [4]
  },
  9: {
    title: "THE NUMBER 9",
    planet: "Mars",
    birthDates: ["9th", "18th", "27th"],
    strongPeriods: [
      "21st March to April 19th-26th (House of Mars Positive)",
      "21st October to November 20th-27th (House of Mars Negative)"
    ],
    description: `The number 9 stands in symbolism for the Planet Mars. This number influences all persons born on the 9th, 18th, and 27th, of any month, but still more so if their birthday falls in the period between the 21st March and April 19th-26th (called the House of Mars Positive) or in the period between the 21st October and November 20th-27th (called the House of Mars Negative.)

Number 9 persons are fighters in all they attempt in life. They usually have difficult times in their early years, but generally they are, in the end, successful by their grit, strong will, and determination.

In character, they are hasty in temper, impulsive, independent, and desire to be their own masters.

When the number 9 is noticed to be more than usually dominant in the dates and events of their lives, they will be found to make great enemies, to cause strife and opposition wherever they may be and they are often wounded or killed either in warfare or in the battle of life.

They have great courage and make excellent soldiers or leaders in any cause they espouse.

Their greatest dangers arise from foolhardiness and impulsiveness in word and action. They are also peculiarly prone to accidents from fire and explosions and rarely get through life without injury from such causes. As a general rule they go under many operations by the surgeon's knife.

They usually experience many quarrels and strife in their home life, either, with their own relations or with the family they marry into.

They strongly resent criticism, and even when not conceited, they have always a good opinion of themselves, brooking no interference with their plans. They like to be "looked up to" and recognized as "the head of the house."

They are resourceful and excellent in organization, but they must have the fullest control; if not, they lose heart and stand aside and let things go to pieces.

For affection and sympathy they will do almost anything, and the men of this number can be made the greatest fools of, if some clever woman gets pulling at their heartstrings.

As a rule they get on with persons whose birth date is one of the series of 3, 6, or 9, such as those born on the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th, or 30th of any month. All these numbers are in harmonious vibration to the number 9 people.

This number 9 has some very curious properties. It is the only number in calculation that, multiplied by any number, always reproduces itself, as for example 9 times 2 is 18 and 1 plus 8 becomes again the 9, and so on with every number it is multiplied by.

This number is supposed to be a fortunate one to be born under, provided one controls it and is not carried away by the excesses of temper and violence that it also represents.

For all purposes of occult calculation the numbers 7 and 9 are considered the most important of all.

The 7 has always been understood to relate to the spiritual plane, acting as the God or creative force on the Earth, and being creative, it is the uplifting "urge" towards the higher development of the spiritual in humanity.

The 9 on the contrary, being, in the Planetary World, the representative of the Planet Mars, is the number of physical force in every form, and consequently stands in relation to the material.

The number 9 representing man and everything to do with the physical and material plane, is the number of force, energy, destruction and war in its most dominant quality. In its relation to ordinary life it denotes energy, ambition, leadership, dominion. It represents iron, the metal from which the weapons of warfare are made and the Planet Mars, which it stands for in Astrology, is the Ruler of the Zodiacal Sign Aries.

The number 9 is an emblem of matter that can never be destroyed, so the number 9 when multiplied by any number always reproduces itself, no matter what the extent of the number is that has been employed.

The number 9 is considered a fortunate number to be born under, provided the man or woman does not ask for a peaceful or monotonous life, and can control their nature in not making enemies.`,
    luckyDays: {
      primary: ["Tuesday", "Thursday", "Friday"],
      fullDescription: `The "lucky" colors for persons born under the number 9 are all shades of crimson or red, also all rose tones and pink. Their most important days in the week are Tuesday, Thursday, and Friday, but more especially Tuesday (called Mars Day).

Number 9 people should endeavor to carry out their plans and aims on all days that fall under their "own number," such as the 9th, 18th, or 27th in any month, but more especially when these dates fall in the "period of the 9", between the 21st March and April 19th-26th, or from the 21st October to November 20th-27th. And when the 9th, 18th, or 27th, falls on their "own day," as mentioned above, or one of their interchangeable numbers which as the 3 and 6, such as the 3rd, 6th, 12th, 15th, 21st, 24th, and 30th.`
    },
    luckyColors: "All shades of crimson or red, also all rose tones and pink.",
    luckyJewels: "The ruby, garnet, and bloodstone, and they should wear one of these stones next their skin.",
    compatibleNumbers: [3, 6]
  }
};
