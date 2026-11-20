/**
 * MONTHLY CHRONICLE DATABASE — Layer 3 & 4 Data Source
 */
export interface MonthlyNumberData {
    character: string;
    finance: string;
    health: string;
    importantNumbers: string;
    colors: string;
    jewels: string;
    climactericYears: string;
    magneticAttraction: string;
  }
  
  export interface MonthlyProfile {
    monthName?: string;
    generalInfluence: string;
    generalCharacter: string;
    generalHealth: string;
    generalFinance: string;
    generalMarriage: string;
    numbers: Record<number, MonthlyNumberData>;
  }
  
  export const MONTHLY_CHRONICLE: Record<string, MonthlyProfile | null> = {
    january: {
    monthName: "January",
    generalInfluence: `The Zodiacal influence for the month of January in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The month of January comes under the Zodiacal Sign of Capricorn.
  The "cusp" of this Sign commences on or about December 21st.
  The "cusp" lasts for seven days, consequently the full influence of this Sign comes into power about the 28th of December and lasts until the 21st of January, when another seven days "cusp" begins under the influence of the next incoming Sign—Aquarius, Third House of the Triplicity of Air.
  Capricorn is the Third House of the Earth Triplicity.
  Its Planetary Ruler is Saturn (Positive).
  It is also called the House of Saturn.`,
  
  
    generalCharacter: `If you are born in this month the basic principles of your character and disposition are as follows: A nature ambitious, militant, energetic and persevering.
  You are capable of enormous efforts towards the attainment of a desired object.
  The planet Saturn, which owing to this month you symbolize, is the embodiment of all that is cautious and discreet.
  You will never take any important step without profound deliberation and unless you are absolutely certain of the result.
  There is no speculative element in Saturn.
  You are skeptical, analytical, somewhat suspicious, slow to accept new theories, but broad-minded and open to conviction.
  The mental force is strong, philosophical and scientific in character; you are a deep thinker and a great reasoner.
  In religion the testimony is inclined to be fanatical in its earnestness, or the mind may swing to the opposite pole and believe in nothing.
  Above all things, you worship intellect, and can forgive almost anything of your friends if they are endowed with unusual intelligence or talent.
  You are exceedingly quick in your intuitions of people and things, but are inclined to be too easily discouraged in your plans, and fall into a despondent state at the first rebuff or disappointment.
  Your views on love, duty and social economics will be always unique, and on this account you will often be regarded as odd and eccentric by those around you.
  Being high-minded and independent, you must lead in whatever you undertake or you will lose interest in your work.
  You abhor restraint of any kind and revolt against anything of an obligatory nature, though in strange contradiction you show profound respect for tradition and authority.
  Life to you is a very serious but involved problem, and you will be inclined to revel in its most pessimistic phases.
  Constant work and industry becomes with you a kind of mania, but by plodding and quietly working with a given end in view, you will gain much more than by excitement or hurry.
  You are likely to rise through your own personal efforts and power of individuality far above the sphere of your birth.
  Your character is essentially positive, but you need to cultivate cheerfulness, as there is likely to be a strong tendency to hypochondria and melancholia.
  As a general rule you will be much misunderstood by others.
  You will not easily mix with people; you will have a few close friends, but at heart feel very much alone.
  You will make many enemies by nearly always espousing the unpopular cause or the "underdog" in any dispute.
  You would do best by aiming at some form of public life, such as in municipal affairs or in connection with politics, government life, or positions of responsibility and trust.`,
  
  
    generalFinance: `FINANCE: The dominant influence of Saturn ruling your birth-month is not a favourable significator as it causes delays, hindrances and limitations in regard to financial advancement, at least in the early part of the life.
  Advancement, gain and success in money is promised by industry, slow plodding perseverance and by carefulness, thrift and economy.
  In fact, you are more likely to acquire wealth through your own personal efforts than by any dint of good fortune.
  Advantageous investments for you would be in land or house property, the building up of factories dealing especially in coal, lead or iron products, machinery for transport work or agriculture, the developing of farming enterprises and all things solid and concrete.
  You will experience much difficulty in obtaining money that should be yours by right and you should never lend without security, or you would be sure to lose.
  You should always see that the concerns in which you invest your money are established on solid foundations as these will be more fortunate to you than things of the more purely speculative order.`,
  
  
     generalHealth: `HEALTH: The Saturnian influence bearing upon this question for you born in January indicates a vigorous constitution and good physical stamina.
  At the same time, there is a strong tendency to depression and despondency which, if not acted against, will induce bilious attacks, trouble with the gall bladder, ulcers in the stomach, derangements of the digestive organs and stoppages of the intestines.
  You should cultivate optimism and cheerful society in order to keep in good health.
  Cold will seriously affect you, and unless you are careful you will be likely to suffer from asthma, bronchial catarrh and such like ailments.
  High dry climates will suit you better than living in low altitudes.
  Study well your diet and keep up the circulation by adequate exercise, also avoid draughts, damp and cold winds.
  Plenty of change is absolutely essential for you, but it should never be a change to solitude.
  If your outlook should ever become limited or cramped, and conditions show signs of giving way, your innate gloom may turn to hypochondria unless you exert every force in your nature to cultivate the spirit of cheerfulness.
  You will greatly desire to make a home for yourself in the country, and if possible, on some height on the side of a mountain or on some hilly place.
  You should never allow yourself to live in low- lying, wet or damp places, as you will have a very decided tendency to develop rheumatism, gout, pains and swellings in the feet.
  You are also likely to meet more accidents to the ankles, feet and legs, than is the lot of most people.`,
  
  
    generalMarriage: `MARRIAGE, UNIONS, PARTNERSHIP, ETC.: You will find your most harmonious relationship in persons born in your own sign (Capricorn) Third House of Earth, December 21st to January 21st.
  In Taurus, April 20th to May 20th, First House of Earth; or Virgo, August 21st to September 20th, Second House of Earth, and in the seven days of the "cusp" at the beginning and ending of each of these periods; also persons born in the exact opposite part of the year to your own, in this case from about the 27th of July to September 27th.`,
  
  
    numbers: {
     1: {
     character: `PERSONS BORN ON JANUARY 1ST , 10TH , 19TH , 28TH NUMBER 1 PEOPLE IN THIS MONTH If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Saturn, in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition is described in previous pages for persons born in January, but the Sun and Uranus will give you a marked individuality of your own.
  You will be very independent in your views, full of originality and creative in your desires.
  Success, unless brought about by very exceptional circumstances, is likely to be delayed until your latter years, but you have every promise that it will come in the end.
  At heart you will be very thoughtful and serious-minded, and extremely thorough-going in everything you undertake.
  You will be level-headed and practical and not easily swayed or influenced by other persons' views.
  You will have a "set purpose" at the back of all your plans, never giving in or allowing yourself to be discouraged by difficulties.
  Although having a very generous nature, you will quickly resent any attempt to be imposed upon and will carry out your own charities in your own way.
  You will be decidedly ambitious and will be likely to rise beyond your fellows and other members of your family.
  Many obstacles may beset your path, but by your patience and determination you will overcome all difficulties.
  You will have a strong magnetic influence over others, especially in any life that may bring you before the public.
  At the same time you may expect to meet much scandal and calumny at different times in your career.`,
  
  
      finance: `FINANCE: You will be frugal and cautious in financial matters, investing your money well in business or industries that promise a good return.
  You will make the most out of any opportunities that present themselves and will endeavour to make the best out of any situation you may find yourself placed in.`,
  
  
       health: `HEALTH: If born on any one of these dates, such as the 1st, 10th, 19th or 28th of January, you will have a great amount of vitality, provided you never indulge in drugs or intoxicants of any kind.
  You will be inclined at times to suffer from severe chills, rheumatism and arthritis.
  To avoid this you should live in high, dry climates as much as possible.`,
  
  
       importantNumbers: `Your most important Numbers are the "one" (which represents the Sun) and the "four" (which represents Uranus).
  You should make every effort to carry out everything important for yourself on dates that make these numbers, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st of any month.`,
  
  
      colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear or at least have in some part of your clothing, the colours of the Sun and Uranus which are: The Sun: All shades of gold or yellow, or bronze to golden brown.
  Uranus: All shades of sapphire blue, greys or pastel colours.`,
  
  
     jewels: `Your "lucky" jewels are diamonds, sapphires and amber.`,
       climactericYears: `The most important or climacteric years in your life are the 10th, 19th, 28th, 37th, 46th, 55th, 64th, 73rd and the 4th, 13th, 22nd, 31st, 40th, 49th, 58th, 67th and 76th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or "four" in any month of the year, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.`
     },
  
  
     2: {
     character: `PERSONS BORN ON JANUARY 2ND , 11TH , 20TH , 29TH NUMBER 2 PEOPLE IN THIS MONTH If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon and Neptune in the Zodiacal Sign of Capricorn, House of Saturn [Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition is described in previous pages for persons born in January, but the Moon and Neptune will give you a more gentle, imaginative and intuitional nature than the majority of people born in January, as previously described.
  You will be inclined to become despondent if things do not go the way you want, and shrink into yourself at the approach of opposition or any rough action by others.
  You will be over- sensitive and inclined to be too easily hurt and wounded.
  You are likely to succeed in gifts of the imagination more than by any hard and fast business methods.
  You will have "day-dreams" of the high positions your ambitions force you to claim.
  Your dreams are likely to become realities if you develop self-confidence in all you undertake.
  Being extremely sensitive, you crave for encouragement to force you to make the best of your faculties.
  You will be restless and unhappy if tied down by circumstances for you must have liberty to carry out your visions.
  The first of these "Number Twos" in Capricorn, commenced on the 29th of December.
  The Right Honourable W.
  E.
  Gladstone is a good example of a "Number Two" person born in this Sign.
  He had extraordinary mental intellect, but although one of the greatest statesmen England ever had, he never became a rich man.
  At the interview he gave me at his home, Hawarden Castle, on August 3rd, 1897, he expressed the deep interest he took in my study of Numbers.`,
  
  
      finance: `FINANCE: You will not be fond of money except as "a means to an end".
  You will have a curious feeling of being above it, knowing that by your brains you can always gain what you want.
  You will be considered more rich than you really are.
  It will hurt your sensitive nature to refuse any demand and for this reason you may at times become impoverished in attempting to keep up your position in the world.
  In spite of this, your natural tendency is to be cautious in money.`,
  
  
       health: `HEALTH: You will be inclined by overwork mentally, to "take too much out of yourself", and so bring on a breakdown of the nervous system, but if so the least "let up" or rest will restore you to good health.
  You are likely to become a great believer in some special form of diet which will be greatly to your advantage.
  You should guard yourself against all forms of gout and rheumatism and live in a dry climate if possible.
  You may at times expect some trouble with your eyes.
  Also weakness, delicacy or curvature of the spine.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the "two", which represents the Moon, and the "seven", which represents Neptune.
  You should endeavour to carry out everything important for yourself on dates that make these numbers, or any one of their series, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th in any month.`,
  
  
       colors: `To increase your magnetic vibrations and make yourself more fortunate, you should wear constantly, or in some part of your clothing, the colours of the Moon and Neptune, which are: The Moon: All shades of white, cream and pale green.
  Neptune: All shades of dove-grey from the lightest to the darkest.`,
       jewels: `Your "lucky" jewels are jade, pearls, moonstones or cat's eyes.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th, 70th and 74th.`,
  
  
      magneticAttraction: `You will find a magnetic attraction to persons born on dates making a "two or a seven" in any part of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.`
     },
  
  
     3: {
     character: `PERSONS BORN ON JANUARY 3RD , 12TH , 21ST , 30TH NUMBER 3 PEOPLE IN THIS MONTH If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the planet Jupiter in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition is that previously described for persons born in January, but being under a strong aspect of Jupiter you will be somewhat aggressive and forceful in all your plans and desires.
  You will have great ambitions underlying all you undertake.
  You will rise in life by your own efforts and your determination to succeed.
  You will meet with considerable jealousy and opposition and will make many enemies in whatever your career may be.
  You would do well in all forms of public life, no matter what class it may be.
  Also in positions of authority where you would have control and responsibility over others.
  You will be inclined to "lay down the law" and will hold firmly to whatever your own views or opinions may be.
  You are not likely to find much happiness in marriage unless you have the luck to meet some member of your opposite sex who will look up to you as their mental superior.
  You will be constructive mentally, capable of making plans on a big scale.
  You should endeavour to carry out your own ideas and not trust too much to others.
  If born on January 21st or 30th, you will more easily rise in life to high positions of responsibility.
  You will have a keen desire, if born on these later dates, to help others or lift the "submerged class" to a better position.
  You will aim to bring good to the masses, more than to the individual; in consequence you will arouse hatred and malice from individual enemies and may at times be in danger of your life from such sources.
  You will not spare yourself in whatever work you set yourself to do and consequently at many periods of your life you will run the risk of complete nervous exhaustion.`,
  
  
       finance: `FINANCE: You will endeavour to make use of large sums of money to carry out your plans or ambitions.
  You will run considerable risk in working out your schemes, as the least miscalculation will allow enemies to pull you down.
  You may expect success as a general rule, provided it is not personal gain that may tempt you to take on too much.`,
  
  
      health: `HEALTH: Although endowed with a splendid constitution you are likely to undermine your health by continual mental strain and overwork.
  Unless you take care and husband your reserve energy, you will be liable to some form of paralysis and heart failure, but it will be largely your own fault if you do not reach the average span of life.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the "three" and its series, representing the planet Jupiter, and the "eight" which represents the planet Saturn.
  You should make every effort to carry out your plans on dates that make the number "three", such as the 3rd, 12th, 21st and 30th.
  If born on January 30th you come under the Sign of Aquarius, House of Saturn (Negative).
  Your numbers will remain the same as those born on the 3rd, 12th, and 21st of January, but being under Saturn (Negative) you will have less restrictions and should be able to make more out of your life.`,
  
  
       colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing the colours of: Jupiter: All shades of violet to violet-purple or mauve.`,
  
  
       jewels: `Your "lucky" jewels are the amethyst, or stones with a violet or purple tinge in them, also black pearls and black diamonds.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 3rd, 8th, 12th, 17th, 21st, 26th, 30th, 35th, 39th, 44th, 48th, 53rd, 57th, 62nd, 66th, 71st, 75th and 80th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three" in any month of the year, such as the 3rd, 12th, 21st and 30th.
  You will also attract to you persons born on the "eight" or its series, such as the 8th, 17th and 26th, but such persons will not be so fortunate for you as those representing the series of the "threes."`
     },
  
  
     4: {
      character: `PERSONS BORN ON JANUARY 4TH , 13TH , 22ND , 31ST NUMBER 4 PEOPLE IN THIS MONTH Born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibration of the planets, the Sun and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition is that previously described for persons born in January, but the influence of Uranus at this date of the month will accentuate all these indications in your case.
  You will be original in your views, extremely independent in your character and not inclined to fit in with the plans or ideas of other people, or those with whom you may be forced to live.
  Your life will be a difficult one in relation to all home ties or marriage.
  You will find yourself much misunderstood in your actions and feel isolated in life.
  You will be unconventional in your views and ideas, and will have to carve out your own road if you want to be successful.
  Your ambitions will be much thwarted by opposition and you will need the greatest exercises of patience in carrying out your projects.
  At heart you will be intensely serious, covering this up at times with the pretence that you are mocking at life's ups and downs and laughing at Fate.
  In reality, deep down in your soul you are a "fatalist", just playing a role on Life's Stage for good or evil, as the case may be.
  The underlying motive of all your actions will be the desire to gain power over others, whether you gain it by the pen, the tongue, or the sword, matters little.
  In some ways these dates in January make a good combination for those who follow a public life, but they give a strong leaning for unusual actions, originality of thought and a distinct trend towards eccentricity.`,
  
  
       finance: `FINANCE: Here again you may expect the unusual to happen.
  Money will be gained by you but to pass out of your hands like water.
  Fame, whether it is good or bad, will last longer for you than finance.
  Your name may be remembered but your grave neglected.
  If you are not extremely careful to lay aside provision for the future your advanced years may find you in a very serious condition.`,
  
  
      health: `HEALTH: In matters regarding health you will find yourself living under peculiar conditions with more likelihood of illness caused by accident than by any form of disease.
  The principal parts of the body more liable to be afflicted are the lower limbs and feet.
  You will have, however, extraordinary vitality.
  It would be difficult to kill you by any means except by violence or accident, and you will be prone to meet with both in the course of your life.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the "four" and its series, representing the planet Uranus, and "one" and its series, representing the Sun, and "eight" and its series, representing Saturn.
  The numbers "four" and "one" are the most fortunate for you to use and act on.
  The "eight" and its series will be greatly drawn into your affairs, but I do not advise you to seek or use these numbers of "eight" if you can avoid doing so.
  The numbers of the eight are the 8th, 17th, 26th of any month.
  You should make every effort to carry out your plans on dates that make the numbers of "four" and "one" such as: 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.`,
  
  
       colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing, some touch of yellow, gold or golden brown, also sapphire-blues, greys or pastel colours.
  The colours of your most important planets are: The Sun: All shades of yellow and gold or bronze to golden brown.
  Uranus: All shades of Sapphire-blue, greys, pastels or "electric colours".`,
  
  
      jewels: `Your "lucky" jewels are the diamond, topaz, sapphires and black pearls.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 10th, 13th, 19th, 22nd, 28th, 31st, 37th, 40th, 46th, 49th, 55th, 58th, 64th, 67th.
  The series such as the 8th, 17th and 26th will also have an important effect, but are not so favourable.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four" or a "one" in any month of the year, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.
  Persons born on dates such as the 8th, 17th and 26th are likely to be much drawn into your life, but will not be so favourable for you from a material standpoint.`
     },
  
  
     5: {
     character: `PERSONS BORN ON JANUARY 5TH , 14TH , 23RD NUMBER 5 PEOPLE IN THIS MONTH If born on any one of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the planet Mercury and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition is that previously described for persons born in January, but the planet Mercury will lessen or make less important any of the bad indications in your case.
  You will have great versatility and your chief difficulty will be to get into a line of work suitable to your talents and ambitions.
  You will try many things in life and change your career many times.
  You will have great adaptability to both people and studies.
  You will love movement and will travel and see a great deal of the world.
  It will be very difficult for you to find your true vocation in life as there is nothing you cannot adapt yourself to, but you may find it hard to stick to anything for any length of time.
  You will get wonderful and unexpected chances and opportunities thrown in your way.
  You will have a keen, penetrating critical mind, but somewhat suspicious of those you come in contact with for the first time.
  People can only influence you through kindness and sympathy.
  You will be tactful and diplomatic; good at winning secrets from others which you will readily apply to some practical purpose.
  You will be fond of literature and be an extensive reader.
  At times you may become interested in science, chemistry and new inventions; occult studies may also claim your attention, but your mind is too practical for any visionary ideas.
  You will be characterized as "having an old head on young shoulders".
  You should cultivate optimism so as to be able to overcome despondency that will seize you in moods.`,
  
  
       finance: `FINANCE: You will be careful and frugal in dealing with money matters.
  You will have a horror of getting into debt.
  You will have sound practical ideas as to investments, but inclined to be over-cautious for your own good and so in money matters miss many opportunities you might otherwise use to your advantage.`,
  
  
       health: `HEALTH: If you were born on January 5th, 14th or 23rd your chief care should be to relax, and remove strain from your nervous system.
  You will feel everything keenly and suffer from moods of temperament.
  At times you will be liable to have fits of despondency which have a depressing effect on the digestive organs, producing in its turn acidity of the blood causing pains in the joints, bones and especially in the knees.
  You will have a good background of a wiry constitution, which will endow you with great resistance to any form of disease that may attack you.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBER is the "five" and all its series, such as the 5th, 14th, 23rd, but as a rule all numbers will be equally lucky for you, except the numbers of "four" and "eight" in all their series, which are 4, 13, 22, 31 and 8, 17 and 26.
  You should endeavour to carry out your plans on your own individual number of "five" or any of its series that make the dates of the "five", such as the 5th, 14th, 23rd in any month.`,
      colors: `To increase your magnetic vibrations and so make life more fortunate, you should wear light colours as much as possible.`,
  
  
      jewels: `Your "lucky" jewel is the diamond, and all glistening stones.`,
  
  
       climactericYears: `The most important climacteric years in your life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 68th, 77th; also the 8th, 17th, 26th, 35th, 44th, 53rd, 62nd and 71st.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a "five" in any month of the year, such as the 5th, 14th and 23rd.
  People born on the 8th, 17th and 26th will be drawn into your life and affairs, but as a general rule will not be so favourable for you.`
     },
  
  
     6: {
     character: `PERSONS BORN ON JANUARY 6TH , 15TH , 24TH NUMBER 6 PEOPLE IN THIS MONTH If You were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the planets Venus and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition will be that described in preceding pages for persons born in January, but in your case the influence of the planet Venus will make such indications more favourable for you.
  Matters of love, marriage and affection will play a very important role in your life and you will be greatly swayed by such things.
  The influence of persons of your opposite sex will cause your life and career to be very eventful.
  You should endeavour to develop your own strong will and individuality in order not to be submerged by such influences, but as a general rule, you will gain considerably by your magnetic personality.
  You would succeed best in business or professions dealing with the public, but of an artistic nature, such as music, art, literature, the theatre and inventions on not ordinary lines.
  In your earlier years you will be likely to be kept back by home conditions or the demands of relatives, also through illness relating to the internal organs of the body.
  The indications are that you will, in the end, surmount all such obstacles and become successful in whatever career you decide to make your own.
  If you were born on the 15th or 24th of January you will come under more fortunate conditions than those governing the 6th.
  You may have equal difficulties to meet with in your early years, but you will more easily surmount them and gain fame and reputation by whatever you set your mind on to accomplish.`,
  
  
       finance: `FINANCE: Those born on January 6th will not be inclined to hoard up money no matter what their opportunities may be, but those born on the 15th or 24th will slowly but steadily build up and strengthen their financial position.
  They will make good provision for their future and have every likelihood of becoming wealthy.`,
  
  
       health: `HEALTH: If you were born on January 6th, 15th or 24th, you may expect more than the average amount of good health all through your life.
  You will have danger from fire and such things as motor cars and should keep yourself and your property well insured.`,
  
  
      importantNumbers: `YOUR MOST IMPORTANT NUMBERS and dates are the "six" and all its series, such as the 6th, 15th and 24th.
  You should endeavour to carry out anything important for yourself on dates making these series.
  You should act very carefully on dates making a "four" or an "eight", or any of their series, which are the 4th, 8th, 13th, 17th, 22nd, 26th, and 31st.`,
  
  
      colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear constantly the colours of the planet Venus, which are all shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are the turquoise and all blue stones.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 6th, 15th, 24th, 33rd, 42nd, 51st, 60th and 69th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "six" in any month of the year such as the 6th, 15th and 24th.
  People born on "fours" and "eights" will be drawn into your life and affairs, but as a rule their burdens and troubles will come on your shoulders.`
     },
  
  
     7: {
     character: `PERSONS BORN ON JANUARY 7TH , 16TH , 25TH NUMBER 7 PEOPLE IN THIS MONTH If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Neptune, the Moon and Saturn, in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition will be that described for persons born in January, but in your case the influence of the above combination will increase or augment such indications.
  You will be intensely devotional, no matter what career you may follow, and at heart innately religious, but your religious bent will be towards some unusual or unconventional form.
  You will be romantic, idealistic, highly imaginative and live in a mental world of your own.
  You will have a keen desire for travel, especially on the ocean.
  The practical or business world will more or less jar on your idealism.
  If you are in the position to do it, you will move about a great deal and have many changes of residence during the run of your life.
  You would succeed well in settling in some part of the world far from the place of your birth, dealing with people of a different nationality to your own.
  If You were born on any of the above dates, circumstances or destiny will lift you into positions of authority or responsibility over others.
  At the same time, life will not be altogether "a bed of roses", especially in connection with domestic matters or sorrows and disappointments caused by your relations.`,
  
  
      finance: `FINANCE: The positions you will occupy will bring you fame and much popularity, but the money that will pass through your hands will not bring you much happiness.
  From a worldly standpoint you will be likely to marry well, but to have severe trials to pass through.`,
  
  
       health: `HEALTH: Your constitution in your early years will be inclined to be delicate.
  You will be prone to have peculiar illnesses difficult to diagnose by ordinary means.
  You should pay particular attention to your throat, lungs and heart.`,
  
  
      importantNumbers: `THE MOST IMPORTANT NUMBERS are those of the "seven" and the "two" and all their series.
  You should make every effort to carry out any important thing for yourself on dates making these numbers, which are the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.
  You should look out as much as possible for difficulties or unhappy conditions brought from persons born on dates making a "four" or an "eight" such as on the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.`,
       colors: `To increase your magnetic vibrations and so make yourself more fortunate you should use shades of greys and greens in your wearing apparel, such as: All shades of dove-grey, pastels or "electric colours".
  All shades of green, creams and white.`,
  
  
      jewels: `Your "lucky" jewels are green jade, moonstones and pearls.`,
  
  
      climactericYears: `The most important, climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a "seven" or a "two" in any month of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.`
     },
  
  
     8: {
     character: `PERSONS BORN ON JANUARY 8TH , 17TH , 26TH NUMBER 8 PEOPLE IN THIS MONTH If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The foundation of your character and disposition will be that described for persons born in January, but in your case the influence of the planet Saturn will be so powerful that such indications will be augmented or increased.
  Persons born on these dates come under what is called "a double Saturn." They generally have some heavy "cross to bear" or great responsibility forced on their shoulders.
  If you were born on January 8th, 17th or 26th, you will have great difficulties and oppositions to contend against.
  You will get little, if any, help from others and will have to depend on yourself for any success that may come into your life.
  You will, however, have great patience, perseverance and determination in all you undertake.
  You will have strong ambition and no amount of opposition will daunt you in any purpose or plan you will set your mind on to achieve.
  At times you will undergo severe spells of depression and gloomy forebodings, or moments of extreme melancholia that will be difficult to shake off.
  You will encounter many trials and sorrows caused by family ties or by the loss of those you love, and the later marriage should occur the better it would be for you.
  You will not be lucky in any form of gambling, speculations or "get rich quick" schemes.
  You will accumulate money by slow, laborious means, by the hard work of your brain, or in some cases by the developing or opening up of lands, mines or minerals, such things as coal, lead, concrete works or large building operations would be favourable for you, together with positions of heavy responsibility.
  You will have a naturally serious disposition.
  You will be a deep thinker, good in reasoning out plans for others and excellent in debate, if the argument presented should sufficiently rouse you to either attack your opponent or defend yourself.
  You will be very decidedly ambitious, not from vain glory or the love of power, but from sterling conscientious motives, especially if you can see your way to be of help to others.
  You will be likely to make strange attachments to those inferior to you mentally, and morally, which will leave you open to criticism and underhand opposition.
  Although never blinded to the faults of others you will be ready to find an excuse for their actions or take the responsibility on your own shoulders.
  You will be "a personality" in whatever your place in the world may be.
  At times you will be the victim of acute moods of despondency, especially if you should reach a point in your career where you could no longer do good work.
  You will never "wear your heart on your sleeve" or let others know your heartaches.
  Your eyes will appear bathed in the light of the Sun, while your feet may walk in darkness.`,
       finance: `FINANCE: In spite of meeting great opportunities, you are not likely to make much provision for your failing years.
  Although capable of giving splendid advice to others you will not follow it for your own personal advantage.
  To the surprise of your friends, towards the end of your days you are likely to become comparatively poor by giving your money away to others or making peculiar provisions in your will.`,
  
  
       health: `HEALTH: In health, sudden and unexpected illnesses are likely to happen.
  Stoppages and strictures of the internal organs and operations may be expected, but against that there will be long periods of good health.
  You should study all questions of diet more than the average person and not allow yourself to live for any length of time in damp low-lying districts.
  You are liable to have injuries to the lower limbs, weakness or turning of the ankles, injuries to the spinal column caused by falls or by accidents.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the "four" and "eight" and all their series, and dates making these numbers will play an important role in your life.
  The numbers that will influence your life the most are the 8th, 17th, 26th of any month.`,
  
  
       colors: `To increase your magnetic vibrations you should wear the following colours: Dark violet-purple, black or blue-black.
  Ultramarine blue, sapphire colours and all shades of grey.`,
  
  
      jewels: `Your "lucky" jewels are black pearls, black diamonds and sapphires.`,
      climactericYears: `The most important of climacteric years in your life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 71st and 80th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making an "eight" or a "four" in any month of the year, such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st, but as a general rule persons born on these dates will lay their burdens on your shoulders.`
     },
  
  
     9: {
     character: `PERSONS BORN ON JANUARY 9TH , 18TH , 27TH NUMBER 9 PEOPLE IN THIS MONTH If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
  The Foundation of Your character and disposition will be that described for persons born in January, but in your case the influence of the planet Mars will make you have a very eventful, stirring and rather fatalistic life.
  Circumstances over which you have little or no control will play a great part in all your affairs.
  You will force your way forward in whatever you undertake, but you will be liable to have unusual "ups and downs" of fortune.
  At times everything will appear to go your own way and again there will be periods when everything will be the reverse.
  Unless you are born in wealthy circumstances made by your forebears, you are likely to have a very hard and difficult beginning.
  Up to about your thirty-third to thirty-fifth year the indications are that you will be forced to undertake a great deal of irksome work at variance to your nature and desire.
  You will be extremely ambitious and will never be satisfied until you attain some position of prominence beyond or above your fellows.
  You will be endowed with a considerable amount of courage and self-assurance which will sustain you well in the battle of life.
  You will possess executive and organizing ability beyond the average person, but to do justice to yourself, you should get into some wide scope of action.
  Rulership or government work of any kind would be in keeping with your nature or any high position of responsibility in connection with industry or enterprise.
  You will have a love of adventure and excitement, which will cause you to encounter danger in many forms.
  You are likely to meet with numerous accidents and risk your life under unusual circumstances.
  Industrious and acquisitive, you will build up any business with which you may be associated, but as there is a strong speculative under-current running through your disposition you will often take on risks that will at times overwhelm you.
  You unconsciously will make enemies and at times you will suffer severely from conspiracies formed against you and treachery from unexpected quarters.
  You are likely to gain socially through marriage, but to have some peculiar experience in connection with it in the latter years of your life.
  You will be quick and irritable in temper.
  You will be dogmatic and headstrong.
  You will make many powerful enemies and will be liable to suffer discredit in your advanced years through treachery and false friends.`,
  
  
       finance: `FINANCE: If born on the 18th or 27th of January, after the age of about thirty-five and up to your sixtieth year you will be likely to control or have large sums of money passing through your hands.
  Thereafter on to the end you will need to exercise great prudence and care if you are to keep your position and wealth.`,
  
  
      health: `HEALTH: From the standpoint of health you will get a good start in life and be endowed with a splendid constitution.
  This is likely to continue up to advanced years when an overstrained heart will begin to put in an appearance.
  If you can lie off and rest you may be able to forestall the evil day for some time, but the indications are of sudden death without warning.`,
  
  
       importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the "nine" in all the series.
  You should endeavour to carry out your plans or anything important on dates making these numbers, which are the 9th, 18th and 27th.
  The number "eight" and the "four" and all their series, and persons born on the 4th, 8th, 13th, 17th, 22nd, 26th of any month will play important roles in your life and career, but there will be something more fatalistic than favourable in connection with these numbers and their series, or persons these numbers represent.
  Personally you should avoid employing the number "four" and the "eight" and all their series as much as possible.`,
  
  
      colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should use the following colours: Mars: All shades of rose, crimson or reds.`,
  
  
      jewels: `Your "lucky" jewels are the ruby, garnet and bloodstone.`,
  
  
      climactericYears: `The most important or climacteric year in your life are the 9th, 18th, 27th, 36th, 45th, 54th, 63rd, 72nd, 81st and 90th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a three, six or nine in any month of the year such as the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th and 30th.`
        }
    }
   },
    february: {
       monthName: "February",
    generalInfluence: `The zodiacal influence for the month of February in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Aquarius, also called the House of Saturn (Negative) commences on or about January 21st, but for seven days being overlapped by the "cusp" of the preceding sign, it does not come into its full power until January 28th or February 1st.
  From this date on, it is in full strength until February 19th.
  From then on it is gradually losing force on account of becoming overlapped by the incoming Sign-Pisces.
  Note: Those born in the "cusps" take from the qualities of both Signs of the Zodiac.`,
  
  
    generalCharacter: `If you were born in February you will be inclined to be over-sensitive and easily hurt and wounded by others.
  You will feel lonely in life though you are likely to make contacts with large numbers of people.
  You will not be demonstrative in your affections or able to express your love nature; you will, however, be intensely loyal to those you love and will fight to the bitter end for a friend or for any cause you espouse.
  You will have strong intuitions about those you come in contact with and will be generally right in your judgment.
  You will "read" people instinctively, but being so sensitive and so disinclined to hurt others, you will be prone to conceal your opinions or keep them to yourself.
  You will be extremely highly strung from the very fact that you cannot "let go" and express yourself, and your nerves at times are likely to become much over-wrought.
  If you do lose control, and say what is in your mind, you will suffer from fits of conscience and bitterly regret what you have said and go to the other extreme in trying to repair the breach.
  You will have a great desire to be active or employed for the public good and will be more than usually generous in helping to relieve the distress of others.
  You will be inclined to aid public charities more than the average individual on account of an innate dread of being imposed upon or "taken in" by a personal "hard luck" story.
  You will have a very logical type of mind and like to have subjects quietly reasoned out with you.
  You will have remarkably good ideas in business and will be found giving excellent advice to others, but as a general rule you will find yourself filling positions of trust and responsibility and more successful for others than for yourself.
  You will require some call of duty or circumstances to demonstrate the sterling qualities that you possess, but if "the call" does come, you will rise to the occasion and surprise everyone by the hidden powers and abilities you possess.
  If you can overcome your sensitiveness and develop self- confidence, there is no position in life you could not attain.
  You would succeed best in some large sphere of action for the good of others.
  Those who become "awakened", if born in this Sign, usually leave a great name behind in the cause of humanity, or by some great new invention that has brought unusual benefit to the world at large.
  You will be inclined to take a deep interest in public movements that attract large masses of people.
  You will be found attending important ceremonies of national interest in whatever country that you may call your own.
  Although living much in yourself, you will exhibit the strange contradiction of liking crowds and going where people congregate, such as mass meetings, theatres, places of amusement and such like.
  You will also exhibit the strange complexity that, although your own nerves are nearly always in an over-wrought condition, yet you will have great power over excitable people or those who are hysterical or insane and you will often find yourself thrown among such types in your journey through life.
  If you are born into wealthy surroundings the likelihood will be that you will never develop your best qualities, but just drift down the stream of life, until too late to make any change.
  You should study the companions you choose more than perhaps any other class, for the reason that being lacking in self-confidence, you could easily become influenced by those you come into close contact with.`,
  
  
    generalHealth: `Health: In health you will be likely to suffer through nerves and the upper part of the stomach, liver and gall- bladder, in a way that it is difficult for doctors to understand or relieve.
  You will be inclined to buy any quack medicine that is well advertised and have always some new pill or tonic to offer to your friends.
  You will suffer, as a rule, with poor circulation of the blood, anaemia, chilblains, pains in the head and back, palpitation and weakness of the heart, disorder of the bladder and kidneys, dropsy; also peculiar accidents to the feet and "turning" or twisting of the ankles or breaking of the bones in advanced years.`,
  
  
    generalFinance: `Finance: The influence of Saturn and Uranus governing this part of the Zodiac gives the likelihood of great and sudden changes in your fortunes, you will always be liable to experience remarkable and unexpected reversals and should be very careful in matters of an uncertain or hazardous nature.
  It is a favourable position, however, for your receiving an income from trusts, insurance companies, banking concerns, also from railway companies, electrical installations, aviation and the floating of new inventions.
  Your income, however, unless you are extremely prudent, will always be more or less uncertain, and it will generally be your portion to experience extremes.
  At some period of your life you are likely to come into a great deal of money from a totally unlooked for source, and in a very peculiar or "out of the way" fashion.`,
     generalMarriage: `Marriage, Unions, Partnerships, etc: You will find your most harmonious relationship with persons born January 21st to February 19th, in your own sign (Aquarius), Third House of Air; or in Gemini, First House of Air, May 21st to June 20th; or in Libra, Second House of Air, September 21st to October 20th; and in the seven days of the "cusp" at the beginning or ending of each of these periods.
  You will be much attracted to persons born in the part of the year opposite your own, in this case from about the end of July to the end of August.`,
  
  
    numbers: {
     1: {
     character: `Persons Born on February 1st, 10th, 19th, 28th Number 1 People in This Month We will now consider the individual birthdays in February.
  I previously called attention to the fact that the ruler of Capricorn (January) was Saturn, Positive; and that the planetary ruler of Aquarius (February) was Saturn, Negative.
  At the commencement of each Sign of the Zodiac there is a period called "the cusp" where it appears one sign overlaps into the other for about seven days.
  January 21st to January 28th is therefore the "cusp" period of both Capricorn and Aquarius.
  Every day from January the 21st the Sign of Capricorn is declining and the Sign of Aquarius is gaining in strength.
  From then, or about January 28th to February 19th, the Sign of Aquarius, whose ruler is Saturn (Negative) is in full force and remains so up to February 19th, when the "cusp" of the next sign-Pisces-commences.
  We have, therefore, to consider that almost the whole month of February is influenced by the Sign of Aquarius, whose ruler is Saturn (Negative) Third House of the Triplicity of Air.
  On account of this, all birthdays during February come under the description given to similar dates in January.
  But, being now under the rule of Saturn (Negative) are not quite so fatalistic in their meaning.
  If you were born on any one of the above dates up to February 19th, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Saturn in the Zodiacal Sign of Aquarius House of Saturn (Negative) Third House of Triplicity of Air.
  You will be under less fatalistic influences than persons born on the same dates in January who are under the rule of Saturn (Positive).
  The foundation of your character and disposition will be that described for persons born in February, but if born on the 1st, 10th, 19th or 28th of the month, you will be more free to carry out your plans and ambitions.
  The early years of your life will be full and active.
  Unexpected changes will happen to your family, plans made by them for you are not likely to be carried out and the chances are that you will start out into the world at an early age to make your own way.
  You will be versatile and full of original ideas.
  You will have great ambition, strong will and determination, and inclined to try many roads in your climb towards success.
  You will excite treachery and underhand dealings by those jealous of you and will have many changes in whatever career you may try during the first part of your life.
  You will not be what is called "lucky" with other people and should be most careful in all dealings with partners or associates.
  You would do better alone in working out whatever your plans may be, as you are liable to be defrauded or easily robbed by others.
  You should always aim for big things and try to come in contact with those in higher positions than yourself.`,
  
  
       finance: `Finance: You should avoid gambles and speculations when other people's interests are concerned.
  At times you may be inclined to over-reach yourself in your efforts to make money quickly.
  For those who lead professional careers such as doctors, lawyers, actors, artists, etc., the month of February is not so favourable in their efforts to hoard up or keep money.
  On the contrary it is a good combination for those engaged in solid businesses, such as bankers, financiers, or heads of large industries, perhaps because persons born in this Sign are better in dealing for other people than for themselves.
  If you were born on February 28th, you will be in the commencement of the incoming sign of Pisces, beyond the zone of Aquarius, the House of Saturn (Negative).
  You should therefore have less restrictions and should expect considerable success in carrying out whatever your career may be.`,
  
  
       health: `Health: If you were born on the 1st, 10th, or 19th of February, you will have a superabundance of mental energy, but will not be as strong physically as persons born on February 28th.
  The digestive apparatus will be inclined to get easily out of order, you should eat lightly but often, and get more sleep than the average person.
  You will, however, have a very wiry constitution and throw off illnesses quickly.
  The greatest change will be in all matters of health.
  If born on February 19th or 28th, you will have wonderful vitality, although inclined to exhaust yourself by overwork or over-exertion.
  You will awake each morning like the Sun, with renewed energy, to begin another day.
  You will be likely to have, however, a tendency for diseases of the liver, impurity of the blood, to catch colds easily and may often be threatened with pleurisy and a delicacy of the lungs.`,
  
  
      importantNumbers: `Your most important numbers are "one", which represents the Sun, and the "four" which represents Uranus.
  You should concentrate your efforts to do everything important for yourself on dates that make these numbers, such as the 1st, 4th, 10th, 13th, 19th, 22nd and 31st.
  Taking the 19th of February as the beginning of the "cusp" of Pisces, the important numbers for persons born on this date and also on February 28th, are the numbers of the Sun and Uranus, the one hyphen four (1-4) and the "three" of Jupiter.
  Coming as these numbers do on the "cusp" at the beginning of the rulership of Jupiter (Negative), we get more fortunate influences over the lives of those born on these dates.
  They will be more free to carry out their ambitions or whatever work they are associated with.
  Less preventive conditions will hamper them than those born on the 1st, 10th, 19th and 28th during January and up to February 19th.
  There need be less fear of the fatalistic number of "eight" cropping up in their lives.
  The numbers they will find the most important will be those of one hyphen four (1-4) the "three", and the series of 1, 4, 10, 13, 19, 22, 28, 31 and if born on the 19th or 28th, the 3, 12, 21 and 30.`,
  
  
      colors: `To increase your magnetic vibrations and so make yourself more fortunate you should, in your clothing, wear the colours of the Sun and Uranus, which are: The Sun: All shades of gold or yellow to golden brown.
  Uranus: All shades of sapphire, dark blues and greys.
  If born on the 19th or 28th of February, the colours of Jupiter can now be added, which are all shades of violet, mauve to violet purple.`,
  
  
      jewels: `Your "lucky" jewels are diamonds, sapphires, amber and topaz.
  If born on the 19th or 28th, you can add the jewel of Jupiter—the amethyst.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 10th, 13th, 19th, 22nd, 28th, 31st, 37th, 40th, 46th, 49th, 55th, 58th, 64th, 67th, 73rd and 76th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one", "four" or "three" in any month of the year, such as the 1st, 3rd, 4th, 10th, 12th, 13th, 19th, 21st, 22nd, 28th, 30th and 31st.`
     },
  
  
     2: {
     character: `Persons Born on February 2nd, 11th, 20th, 29th Number 2 People in This Month If you were born on any of the above dates in February, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Moon and Neptune but being born in February, Saturn is in its Negative house.
  Consequently Saturn, not having the same degree of afflicting, constricting, or fatalistic conditions, you will be under more favourable influences and more able to carry out your plans and ambitions.
  Your basic characteristics will remain the same as those given for persons born in February, as described in previous pages.
  You will be romantic and idealistic and will have many love affairs of a more or less unusual kind.
  You will have considerable ambition and will get many chances of bettering your position.
  You are likely to find your early home life and surrounding not very congenial and the likelihood is you will go out in the world "on your own".
  You will, however, have to conquer your "over- sensitiveness" and develop the "self-confidence" that is so necessary to persons born under these numbers, especially in the commencement of the year.
  You will have many changes in your life and career, and a great desire to travel and see other countries far from your land of birth.
  You will have many talents, but will be inclined to develop gifts of the imaginative faculties and would do well in new inventions, especially those of wide service to humanity at large.
  You will have a keen desire to express yourself in art, literature, music or the drama, and would succeed in such things.`,
  
  
      finance: `Finance: You are likely to become rich in your later years by your own abilities, but may also inherit money or property.
  You will be likely to have many important gifts and honours bestowed on you.
  If you were born on February 2nd, 11th or 20th, you will have many difficulties and restrictions in finance in your early years, unless you happen to be born in good circumstances.
  But in the end you will be bound to succeed by your own mental talents, especially those in the domain of inventions, or in relation to the artistic world.
  If you should happen to get into something very promising in some investment under your own control, all will be well, but your danger will be, if you are in some profession, that money will not stick in your hands and that you will not make enough provision for your advanced years.
  If born on February 29th, in a "leap year", coming into the Sign of Pisces, you will have less restrictions and be more fortunate in early life.`,
  
  
        health: `Health: In matters of health you will have little to complain about.
  You will have a good constitution for your background and will be likely to form a set of rules on "the simple life" order, that will give you a promise of living to an advanced age.`,
  
  
       importantNumbers: `Your "lucky" colours and jewels remain the same as given for persons born on the same dates in January, but you need no longer fear the influence of the "Number eight" being as fatalistic in your affairs.
  But this number, together with the "four" and all their series, should still be guarded against or avoided as much as possible.
  For those born on February 20th and 29th, being born on the "cusp" of Pisces, the House of Jupiter (Negative) their most important numbers will be the two, seven and three and all their series, such as the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, and the 3rd, 12th, 21st and 30th.`,
  
  
     colors: `The Moon: All shades of white, cream and pale green.
  Neptune: All shades of dove-grey from the lightest to the darkest.`,
  
  
      jewels: `Green jade, pearls, moonstones, or cat's eyes.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a two and seven in any month of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.`
     },
     3: {
      character: `Persons Born on February 3rd, 12th, 21st Number 3 People in This Month If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Jupiter and Saturn in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
  If you were born on February 3rd or 12th, you will have the same qualities as described for persons born on similar birthdates in January, but as you now come under the rulership of Saturn (Negative) you will have much more favourable conditions under which to carry out the Jupiter qualities of your Birth Number.
  These qualities are, in brief: Strong will, determination of purpose, a very decided talent for organization particularly in public matters, government departments or politics.
  The quieting, sobering influence of Saturn, when negative or mental, is one of the finest influences to a Jupiter person born under the Sign of Aquarius.
  No better example of this could be found than in the character of Abraham Lincoln, born on the 12th of February.
  If you were born on the Feb.
  21st, being already in the "cusp" of the incoming Sign of Pisces, whose ruler is Jupiter (Negative), you will feel the good influences of this favourable planet and will be under better material auspices than if born earlier in this month.
  As the 21st of February is a Jupiter number (3), and you are born at the commencement of the "cusp" of Jupiter, you should allow your ambitions to have full rein with every promise of being successful.
  All work leading to responsibility and authority over others is decidedly favourable to you, no matter what that work may be.
  There is no career in which you cannot succeed, provided your ambition is aroused.
  As Jupiter is termed Negative in this position, your ambition will be more mental than physical.
  This means that although fitted for positions of authority over others, you may shrink from what might be called the "physical contact." In that case, you will be likely to organize large undertakings and yet not receive the public approval that may fall to others.
  In any case, no matter what the viewpoint mentally is that you may take, persons born on February 21st have every reason to expect success.`,
       finance: `Finance: If you were born on February 3rd, 12th or 21st you may expect to gain more than usual success and position from whatever line of work you may take up, but more especially so if born on the 12th or 21st.
  As this is very much one of the mental Signs of the Zodiac, it will all depend on what you set your mind to accomplish.
  You will meet at times, however, with heavy losses in money in spite of whatever prudence you may use.`,
  
  
       health: `Health: In matters of health you will run a danger of nervous exhaustion from overwork, a liability for neuritis and sciatica, inflammation of the liver, hardening of the blood vessels and arteries, and high blood pressure.
  You should reduce nervous tension as much as possible, live on a simple diet and get plenty of sleep.`,
  
  
      importantNumbers: `Your most important numbers are the "three" and "eight" and all their series, such as the 3, 8, 12, 17, 21, 26 and 30.
  As you were born in the Zodiacal Sign of Aquarius ruled by Saturn (Negative) owing to the declining influence of this planet you will be more fortunate than if born on the same dates in January.
  You will, however, still attract the influences of the numbers "four" and "eight", and all their series, also persons born on these dates; such as on the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.`,
  
  
       colors: `The jewels and colours are the same as for other number "three people", namely, all shades of violet, mauve and violet-purple.`,
  
  
      jewels: `The "lucky" jewel is the amethyst, and all purple coloured stones.`,
  
  
        climactericYears: `Your most important or climacteric years of life are the 3rd, 12th, 30th, 39th, 48th, 57th, 66th and 75th.`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three" in any month of the year, such as the 3rd, 12th, 21st and 30th and such persons should have a favourable influence in your life and career.`
     },
  
  
     4: {
      character: `Persons Born on February 4th, 13th, 22nd Number 4 People in This Month If you were born on any of the above dates in February, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Uranus, the Sun with Saturn (Negative) in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in previous pages for persons born in February.
  As the Sun (1) is always linked in this study with Uranus (4) and written as one hyphen four (1-4), so when Uranus is the principal, as in this case, it is written as four hyphen one (4-1).
  As Saturn, although now in its negative House, is still the Ruler of this part of the Zodiac, until February 19th, if you were born on the above dates you will remain under its influence.
  Your important numbers are, therefore, four, one and eight and all their series, such as 1, 4, 8, 10, 13, 17, 19, 22, 26, 28 and 31.
  The qualities and characteristics of persons born on February 4th, 13th and 22nd, are so similar to those given to these numbers in January that I need not repeat them again, except to emphasize that, as you are now under Saturn Negative and not Saturn Positive you are less under the restricting influences of this planet, and consequently should be able to make more out of your life.
  At the same time I must warn you to continue to avoid, as much as possible, using the numbers "four" and "eight" and not make plans or engagements that come under these numbers or any of their series, such as 4th, 8th, 13th, 17th, 22nd, 26th and 31st.
  The best numbers and dates for you are the Sun Numbers 1st, 10th, 19th and 28th, with the interchangeable Moon Numbers-2nd, 11th, 20th.
  If you were born on February 4th, 13th or 22nd you will be very original in your views and unconventional in your actions.
  You will lean mentally towards "new thought" in all its phases.
  New philosophies or new religions will appeal very strongly to you, also new methods and independence of thought and action.
  You are likely to be classed by your fellow mortals, as odd, peculiar and "individual." For this reason, you will not, as it were, easily "fit in" with the ideas of those you meet with in ordinary life.
  This is accentuated by your being under the influence of Saturn (Negative), which, although negative, must now be considered as more affecting the mental side of your nature.
  Consequently, although to a great measure escaping what may be described as the more fatalistic influence of the Saturn vibrations, you will be inclined to be tinged with its melancholy, philosophic quality, which together with your own Uranian peculiarities, tends to increase your sensitiveness and will often make you shrink from personal contact with others.
  Children born on these dates, and in fact, all born on days that make the numbers "four" and "eight" especially in both January and up to February 22nd, should be treated with great consideration and sympathy, any rough treatment or harshness being absolutely wrong for their mental development.
  Such minds are so sensitive that they feel everything acutely.
  Being peculiarly secretive, and undemonstrative, they are unable to express themselves and are easily misunderstood.
  So much is this the case that I have often found persons born under the "fours" and "eights" of any month, but more especially those in January and up to February 22nd, accused of things they have never committed.
  I have known many persons born under these numbers or dates falsely accused at the bar of justice and seen even ordinary rights denied them.
  The 22nd of February, being the commencement of the "Cusp" of the incoming Sign of Pisces, whose ruler is Jupiter, is, as a rule, more fortunate than the other number "four" persons born in February.
  We will now consider February 22nd.
  This "number four", being already in the "cusp" of Pisces, comes more under the rulership of Jupiter (Negative).
  The influence of Saturn at this date is passing away, but Jupiter in this part of the Zodiac relates more to the mental than physical side of things.
  We consequently find persons born on February 22nd developing all those qualities of mind that belong to the higher side of the Jupiter character, linked with the Uranian of the "number four".
  Here, Uranus is free to carry out its independent views, its dislike of convention, its "new thought", its rebellion against old forms of statecraft or government.
  At the same time, the Jupiter influence changes "the rebel" into a conqueror.
  He uses "new ideas" to fight with, the inventive qualities of Uranus he turns to good account, he may deplore the carnage and slaughter of war, but the "new" cannot be born without pain.
  When the battle is over he will treat his enemy with magnanimity—the Jupiter quality would not allow him to act otherwise—Uranus has brought "the new", a "new state" into being, but under the combinations of Uranus, the Sun and Jupiter, whatever it would be, it would have an unusual and unconventional beginning.
  George Washington, the first President of the United States, born February 22nd, is a remarkable example of the above combination.
  Persons born under the influence of February 22nd generally meet with considerable opposition to their views or plans.
  They are inclined to be much misunderstood; they live "in themselves" as it were.
  They are not demonstrative and are not willing or ready to express themselves in words.
  They are more organizers than orators.
  They care little for conventionalities or for the opinion of others.
  They have a philosophical trend in their way of looking at life.`,
  
  
      finance: `Finance: If born on any one of these dates in February, financial matters will not appeal to you as much as they do the average person.
  You will be inclined to gain money in unusual ways and also to lose it in equally unusual ways.
  By employing extra prudence and caution, you may be able to protect yourself to a certain degree, but you will always have to be on your guard against swindlers and "get-rich-quick" schemes.`,
  
  
      health: `Health: In your case health will always be a question of "mind over matter." As long as you are in a happy frame of thought and interested in whatever work you are doing, you will keep well and disease will not attack you.
  If however, you allow yourself to feed on gloomy thoughts, you will never feel fit or well and would be liable to bring on a form of nervous disorders of the digestive tract very difficult to cure.`,
  
  
       importantNumbers: `Persons born on the 4th, 13th and 22nd of February, have few numbers that are favourable for them, in fact only the numbers of the Sun, the "one" and its series, (for the interchangeable number "two" of the Moon being feminine in quality is not powerful), I strongly recommend all those born under the numbers of fours and eights to so alter their name to produce a stronger combination, such as the number of 1, 3, or 6.`,
  
  
      colors: `All shades of gold, yellow, bronze to golden brown, and mauve, violet or violet-purple.`,
  
  
      jewels: `The jewels and colours for person born on February 4th or 13th remain the same as those given to persons under the same dates in January.
  (Sapphire, diamond, topaz, amber).`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 4th, 10th, 13th, 19th, 22nd, 28th, 31st, 37th, 40th, 46th, 49th, 55th, 58th, 64th, 67th, 73rd and 76th.`,
  
  
       magneticAttraction: `If you were born on any one of these dates in February, you will find a strong magnetic attraction for persons born on days making a one, four, or eight in any month of the year, such as the 1st, 4th, 8th, 10th, 13th, 17th, 19th, 22nd, 26th, 28th and 31st.`
     },
  
  
     5: {
      character: `Persons Born on February 5th, 14th, 23rd Number 5 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Mercury, with Saturn (Negative), in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in previous pages for persons born in February.
  The combination of Mercury and Saturn in this period, is good to be born under, as the qualities of Mercury are influenced by the conscientious painstaking nature of Saturn and is excellent for mental development.
  If born on February 23rd being in the "cusp" of the incoming Sign of Pisces, ruled by Jupiter, you will be very dominant and independent in your character, and care little whether the world appreciates your work or not.
  All these dates in February produce a keenly critical frame of mind.
  They give a penetrating knowledge of human nature, with a curiously strong influence over others.
  Such persons have a remarkable power of "the eye" easily subduing excitable people and compelling them to listen to reason and logic.
  As doctors they have an almost uncanny power of diagnosis.
  They are great readers, rapidly absorbing what they read or hear, with retentive memories which they draw upon when the occasion requires for the benefit of others.
  They love science and all proved facts.
  They are sceptical of theories and yet at heart are metaphysically inclined.
  They are not seekers for wealth or position, but at the same time are extremely ambitious that their work should become recognized.
  Although very self-contained, they deeply appreciate encouragement and will do almost anything for a few words of praise or kindness.
  If disappointed in their ambitions they easily become morbid and melancholy.`,
  
  
       finance: `Finance: As regards money matters, persons born on these dates in February are excellent in giving advice to others on financial questions, but rarely can follow it for themselves.
  They often make money and become wealthy by the work of their brains, but they seldom can hold on to it or make provision for their old age.
  If you were born on any one of these dates, I would strongly advise you not to go in for any speculative business, but to only risk investments in such things that would be under your own control.
  People will always be ready to take from you, but to give you as little as possible in return.`,
  
  
       health: `Health: As a general rule you will be healthy and full of energy, but in periods liable to complaints of the liver, spleen, kidneys and bladder.
  There is one set of people born on these dates in February who, if born with money, ruin their constitutions by their craving for strong drink, drugs and extravagant living.
  These persons are easily recognized by their lack of purpose, restlessness and extreme irritability.`,
  
  
       importantNumbers: `If you were born on February 5th, 14th or 23rd, your best numbers are the series of "fives" and dates such as the 5th, 14th and 23rd in any month of the year, but more especially so during February, June and September.`,
  
  
      colors: `For favourable colours you should wear all light shades, especially white or glistening materials.`,
  
  
      jewels: `Your "lucky" jewels are diamonds and white glittering stones of all kinds.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 59th, 68th and 77th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" in any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on February 6th, 15th, 24th Number 6 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Venus, with Saturn (Negative) in the Sign of Aquarius, Third House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in previous pages for persons in February.
  Persons Born on February 6th or 15th come under the vibrations of Venus, with Saturn (Negative), while those born on February 24th, being in the "cusp" of the incoming Sign of Pisces, respond to the influences of Venus and Jupiter.
  For February 6th and 15th, the Venus quality being more or less dominated by Saturn, we get natures where love and affection mean everything to them, and are yet inclined to be "unlucky" in such matters, chiefly on account of the intensity and "single track" quality of their minds.
  Either out of blind trust, or extreme devotion to those they love, they are inclined to give everything they possess to those they care for, whether they are proved to be worthless or otherwise.
  If, by chance, they do find someone who can appreciate their noble devotion, there is still generally some heavy cross for them to bear.
  In any case they seldom get the satisfaction in love that they demand.
  Very often they either marry beneath their social status, or someone that mentally is their inferior.
  Some of the most wonderful examples of love and self-sacrifice I have come across have been born on those dates in February, but in all cases the desire for love has been the dominant chord in their lives.
  As a general rule, all the "number six" people born in February have a natural artistic sense.
  They do well and make a name for themselves in any career that may bring them before the public.
  In such cases they attract love and affection from the masses and they "love their public".
  They care little for the money their art may bring and for that reason they are always tempted to do things on a large scale and in consequence even the most gifted under this planetary combination in February quite often die poor.
  An example may be drawn from the life of Sir Henry Irving.
  There was probably no man who so lived for his public or one who loved his public more.
  He was born on February 6th and yet, with all his success and fame, died a very poor man.
  He craved for love and affection which he got from the masses, but his own private life was a tragedy in that respect.
  If you were born on the 6th, 15th or 24th of February, you will be much attracted to social life of all kinds.
  You have the faculty of making friends easily wherever you go and forming acquaintances with strangers.
  You will be adored by inferiors and those who take orders and at the same time you will attract to you persons of high rank, position and wealth.
  You will be fond of romantic unusual episodes, will have much influence over your opposite sex yet have the curious contradiction of being ready to throw aside pleasure for the "call of duty" or for some cause that enlists your support.
  You will be a kind of "hero to yourself", always following an idealistic dream or some star that leads you onward through the early nights of hardships and disappointments.
  And yet, you will succeed—of that you need not have a moment's doubt.
  At times you will risk the impossible feeling in your own heart that to you all things are possible.
  Your natural tendency, unless you have an exceptionally strong will, is to love luxury and extravagance and in consequence to run into debt.
  As a rule, however, you will be under such a good planetary combination that you will find people willing to come to your assistance and help you out of any hole that your natural generosity has brought you into.`,
  
  
       finance: `Finance: Once your early years are over you will begin to feel the tide of luck running in your favour.
  You will be likely to do many foolish things in finance and go into many "wild- cat" schemes and yet fall on your feet.
  You will be likely to gain by public enterprises or to be backed up by the public.
  You would do well as a company promoter and create a large following for schemes born in your brain.
  There will, however, always be the danger of over-reaching yourself and meeting at times with heavy financial loss.`,
      health: `Health: You will be endowed with a healthy physical body, have little anxiety about illness, inclined to run risks of exposure to changing climatic conditions and bring danger to yourself by not thinking enough about your own health.
  The weakest part of your system will be a likelihood of pneumonia, trouble with the bronchial tubes and lungs and overwrought nervous tension.`,
  
  
       importantNumbers: `Your "lucky" number is the "six" and any of its series, and dates such as the 6th, 15th or 24th would be the best for you to choose for any important matter.`,
  
  
       colors: `Your most favourable colours are: All shades of blue from the darkest to the lightest.
  If born on February 24th, you may also use all shades of violet, mauve or violet purple.`,
  
  
      jewels: `Your "lucky" jewels are the turquoise, and all blue stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 6th, 15th, 24th, 33rd, 42nd, 51st, 60th, 78th, 87th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "six" in any month of the year, such as the 6th, 15th or 24th.`
     },
  
  
     7: {
      character: `Persons Born on February 7th, 16th, 25th Number 7 People in This Month If you were born on the 7th, 16th or 25th of February, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the numbers "seven" and "two", and "four" and "eight", represented in Astrology by the planets Neptune (7), Moon (2), Uranus (4) and Saturn (8) in the Zodiacal Sign of Aquarius Third House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in previous pages for persons born in February.
  If born on the 7th or 16th you will be very different in nature from persons born on February 25th for the reason that those on the late date, being born past the "cusp" of February 19th, come under the influence of the incoming Sign of Pisces, ruled by Jupiter (Negative) and consequently have less of the restrictive influence of Saturn in their lives.
  If you were born on the 7th or 16th of February you will have a peculiarly sensitive highly strung nature.
  You will find it extremely difficult to find your true bent or career, and may pass your entire life searching for it.
  If however, you do find some purpose to occupy your attention, you will cling to it with great obstinacy and determination.
  Being extremely sensitive to your surroundings and the vibrations of others, you should be most careful where you live, or with whom you come in contact.
  You are likely to be gifted with some unusual quality of imagination, ideality and romance.
  You will be inclined not to have enough self-confidence or belief in yourself to force your way into public unless the call comes from some source outside of yourself.
  If "the call" does come, if you are born on the 7th, 16th or 25th of February, you will make any sacrifice or face any hardships to do what you consider your duty.
  You will act on the same lines if you devote your attention to art in any form.
  It will always be the purpose or object that will attract you more than own personal gain.
  You will at times be instinctively drawn towards investigating unusual phenomena, such as telepathy, occultism, spiritualism, magnetism, astronomy or astrology.
  You will be inclined to study "mind" in any of its manifestations and in consequence, will often be taken to task for having "queer friends." You will have an unusual sympathy for persons who are mentally unbalanced, and often deplete your own resources to aid those you love, also institutions in their good work.
  If you were born on the 7th or 16th of February, you will have what might be termed a natural intuition about people, but may seldom be able to give any logical reason for your likes and dislikes.
  In the same way you will seem to absorb knowledge about things, but not by ordinary study.
  If born on the 25th of February although also coming under the influence of the numbers "seven" and "eight" and "two", you will be very different from persons born on the dates previously described.
  The 25th of February, being half way through the "cusp" of Pisces, comes under the influence of the Jupiter vibration, and as a rule, persons born under it make much out of their lives.
  They are intensely conscientious over any work they are engaged in quite irrespective of financial gain.
  All "number seven" persons born in February become noted for the original way in which they regard both life itself and whatever the work may be that has engrossed their attention.
  They love reading and often excel in literary work, and as artists before the public.
  They develop peculiar ideas about religion and cannot follow any old established form.
  They are not irreligious for they are deeply imbued with its mystery and influence over the masses but at the same time they appear to resent dogma in all its forms.`,
  
  
       finance: `Finance: Persons born on these dates in February are not sufficiently worldly to care much about material gain.
  They are seldom lucky in finance and generally meet with loss in any form of speculation.
  Money passes through their hands easily on account of their generous nature and their desire to be of help to others.
  If you were born on February 7th, 16th or 25th, I can only advise you to be satisfied with small returns on such things as Government Bonds, etc., to avoid speculative schemes and all forms of gambling.`,
  
  
      health: `Health: Persons born on these dates in February have often very peculiar experiences as regards health.
  They generally pass through a good deal of delicacy in their early life and are usually much experimented on by doctors to whom they are always more or less a puzzle.
  They are themselves ready to try various kinds of "cure-all" remedies and waste money on such things.
  They often have some mysterious form of "stomach trouble" and are peculiar in their diet and choice of food.
  They are so over- sensitive to the vibrations of others, that they are often ill from being in the company of someone to whom they feel antipathy.
  Persons Born on February 7th, 16th and 25th, should avoid drugs and medicines as much as possible.
  Plenty of fresh water, sleep and a simple diet will set them on their feet more quickly than all the "specialists" in the world.`,
  
  
       importantNumbers: `If born on one of these dates in February, your important numbers, colours and jewels will be the same as those described for those born on the 7th, 16th or 25th of January, but with this difference: If born on February 25th, you will have for your secondary colours all shades of mauve, violet and purple- violet.
  If you were born on February 25th you should endeavour at all costs to take up some special form of work as much out of the beaten tracks as possible.
  Being so much on the mental plane you are likely to meet with deception and cruel treatment from those who devote their lives to material advancement or who make a god of gold.
  Your important numbers are the seven hyphen two (7-2) and all their series.
  You should endeavour to carry out your plans, or do anything important for yourself on dates making these numbers, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.
  You should be extremely careful of doing anything important on dates making "fours" or "eights", such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.`,
  
  
       colors: `Your favourable colours are all shades of green, creams, whites and dove-greys.
  (Plus mauve, violet and purple- violet for Feb 25).`,
  
  
      jewels: `Green jade, pearls, moonstones.`,
      climactericYears: `The most important or climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "seven" or "two" in any month of the year such as the 2nd, 7th, 11th, 16th, 20th, 25th, 29th.
  Also persons born on "ones" and "fours" such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st of any month.`
     },
  
  
     8: {
      character: `Persons Born on February 8th, 17th, 26th Number 8 people in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn (Negative) and Uranus in the Sign of Aquarius, Third House of the Triplicity of Air.
  If born on February 26th, being so far advanced in the "cusp" of the incoming Sign of Pisces ruled by Jupiter, you will come under the influence of the latter planet as well as that of Saturn (Negative) and Uranus.
  The basic foundation of your character and disposition is described in previous pages for persons born in February.
  The influence of Saturn (Negative) in this period of the year lasts up to February 19th, when the "cusp" Pisces commences, but the influence of the incoming Sign does not come into its full power for seven days-namely until on or about February 26th.
  If you were born on February 8th, 17th or 26th you will have a very decidedly marked personality of your own, together with a life that will stand out among your fellows.
  You will be a deep thinker no matter what your career may be, but one with a philosophical turn of mind.
  Very peculiar circumstances and opportunities will come into your life without your seeking them, also a strangely fatalistic current of affairs will sweep you into positions of responsibility, even without your seeking.
  If born on February 26th the Jupiter influence will be likely to bring you greater success from a material standpoint but all persons born under the influence of the "number eight" may expect sooner or later to be attacked by underhand enemies and to be the victims of calumny, scandal and hostile criticism.
  Unless born "into money" the early years of such persons will be hard and difficult and will not give the promise of success that the latter years bring into being.
  If you were born on any of these dates in February you may expect to meet severe trials and sorrows through your affections and in your home life.
  Separation, illness or death is likely to play a strangely fatalistic role with those near and dear to you.
  Marriage will bring you some unusual experience out of the ordinary and should there be children they will cause you grief or serious anxiety.
  You will have more satisfaction mentally than materially.
  You will be likely to gain money, become rich or hold some powerful position, but for all such things you will be liable to pay too high a price.
  As a general rule all the "number eight" people, no matter what month they may be born in, have most decidedly marked characteristics of their own.
  They are either great successes or great failures.
  Things are inclined to go to extremes for them one way or another.
  They either play a great role on life's Stage, for good or evil, or remain as "souls in prison" unable to break free.
  In all cases, "number eight" people, and especially those born on this number in January and February, may be expected to lead unusual lives.
  It is this very law governing them, whether it is due to Fate or their own temperament, that they should endeavour to harness into whatever their purpose may be.
  If you are born on any of these dates such as the 8th, 17th or 26th of February, your name is likely to go down to posterity for something unusual in your life or career.
  It may not be given to you to be extremely happy in your home life or immediate surroundings, but you will stand out as "a personality" wherever you may live.`,
       finance: `Finance: Persons born on February 8th, 17th and 26th, can always make money, provided they apply themselves to that one purpose.
  This especially is the case for those born on February 26th.
  They will, however, be liable to lose money by actions caused by their opposite sex, or by litigation and by blackmail.
  You may make money by whatever work you may go in for, but the chances are, it will be taken from you by people or circumstances, and you should be advised to make provision for your old age.
  You should not engage in speculation of any kind, not because of bad judgment on your part, but simply for the reason, that conditions or circumstances over which you have little or no control are likely to crop up and rob you of financial certainty.`,
  
  
       health: `Health: Persons born on these dates in February give the appearance of being more healthy than they really are.
  They get little or no warning about illness, they often suddenly collapse from heart failure or a clot of blood on the brain.`,
  
  
      importantNumbers: `Numbers appear to have an important bearing on the lives of persons born on dates making "fours" and "eights" in the month of February.
  The reason the four and its series, such as 4, 13 and 22, has such influence in this month, is because it is under the Zodiacal Sign of Aquarius and is not only the House of Saturn, Negative, but it is at the same time the House of the planet Uranus (4) and also its "exaltation." When we come to consider people born on the 26th of February this being the "cusp" of Pisces, whose ruler is Jupiter (3), vibrations change to those of eight and three, which enables persons born on February 26th to be more the master of their own destiny than those born on the same date in January or on February 8th or 17th.
  Persons born on the 26th of February, having the Jupiter influence at their back, if I may be allowed to put it this way, will find themselves less restricted by circumstances, surroundings or family ties, and more free to carry out whatever their ambitions may be.
  Your most important numbers are "fours" and "eights" and all their series, such as the 4, 8, 13, 17, 22, 26 and 31.
  If born on February 26th the "three" and its series will play an important role and would be more fortunate for you to use than the "fours" and "eights." Dates made by the "number three" would also be more lucky for you, such as the 3rd, 12th, 21st and 30th.`,
  
  
      colors: `The most favourable colours for you are the odd shades of blue of the sapphire order and all dark colours, except reds.`,
  
  
      jewels: `Your "lucky" jewels are the sapphire, black pearl and black diamond.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th, 71st, 76th and 80th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four" or "eight" in any month of the year, such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.
  But as a general rule those born on these dates will bring their trouble and sorrows on to your shoulders.`
     },
  
  
     9: {
      character: `Persons Born on February 9th, 18th, 27th Number 9 People in This Month If you were born on any of the above dates in February, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars with Saturn (Negative) but if born on the 27th as you are already in the commencement of the Sign of Pisces, you come under the influence of Mars with Jupiter (Negative).
  The basic foundation of your character and disposition is described in previous pages for persons born in February.
  The nearer these "number nine" persons are born to the "cusp" of February 19th, the more decided will their individuality become.
  Consequently, one may expect more from those born on February 18th, than from those born on February 9th.
  The 27th of February, being at the farther end of the "cusp" comes under influence of the vibrations of Mars and Jupiter.
  As a general rule this is a fortunate combination, for Jupiter, being negative in this part of the Zodiac gives zest and ambition to the mental qualities, and Mars untiring energy in whatever line of work they set out to achieve.
  Persons born on the 27th of February generally make "a name for themselves." Joseph Renan, born February 27th, celebrated "free thinker" and writer who caused such a furore by his "Life of Christ," is a good example of the independence of character and marked individuality that may be expected from a person born on this date.
  Ellen Terry, the famous actress, also born on February 27th, had such a decidedly outstanding personality that no matter what role she played, or how beautifully she played it she was always Ellen Terry.
  This quality of individuality is very similar for those born on February 18th.
  Wilson Barrett, the celebrated actor, whom I knew intimately, is also a good example.
  He was born on February 18th.
  In spite of his small stature he dominated every person on the stage the moment he appeared.
  All number nine persons born in February, such as on the 9th, 18th, and 27th will exhibit similar mental characteristics as those I gave for persons on the same birth number in January, only their tendencies will be more mental than otherwise.
  They will also appear to be more "Masters of their Fate" and not so much subject to the "ups and downs" and reversals of fortune that so often happen to persons born on the same numbers in January.
  If you were born on February 9th, 18th or 27th, you will exhibit marked independence in thought and action, also strong will for any cause you may espouse or for any person you may consider badly treated.
  You will stamp everything you do with your own distinct personality.
  You will have good reasoning powers, very convincing and forcible in debate, ability to see both sides of an argument and quick to seize on any weak point left open by your opponent.
  You may be criticised for being too frank and impulsive in speech, headstrong and determined to have your own way, but you will win people over to your side by your magnetic personality.
  At heart you will be a humanitarian, always ready to devote yourself for the benefit of others, or to play a role in social reform.
  Your nature will make for you many enemies and cause considerable opposition to crop up against you.
  You will be good as an organizer, so long as the work lies on large lines, very generous to those under you and watchful of their interest.
  There are many sides of activity in which you would find recognition, from the feeding of an army to the development of an industry.
  All would fit in naturally with you, but in whatever you do, the call of the public will be preeminent.`,
  
  
       finance: `Finance: Under certain conditions you would be fortunate in financial matters, but a surprise to others in the way you would make use of your wealth.
  It is quite likely you may in some unconventional way get rid of it before the end comes, or tie it up in some trust fund for some cause or unusual charity.`,
  
  
       health: `Health: In matters of health you have not much to fear.
  You will think of it as little as possible and perhaps for that very reason escape the usual ills that all are heir to.
  You should, however, pay attention to the lungs and the heart.`,
  
  
      importantNumbers: `Your most important numbers will belong to the "nine" and all its series, and your best dates for any decided effort of your own will be the 9th, 18th and 27th of any month of the year.`,
      colors: `Your most favourable colours will be those of your planet Mars, all shades of crimson, red and rose.
  If born on February 27th, under the Jupiter vibrations you can use as your secondary colours all shades of mauve, violet or violet-purple.`,
  
  
       jewels: `Your "lucky" jewels are the ruby, garnet and all red stones.
  For the same reason, you can wear the amethyst (the jewel of Jupiter) as well as garnet, ruby or bloodstone (jewels of Mars) if born on February 27th.`,
  
  
       climactericYears: `The most important or climacteric year in your life are the 9th, 18th, 27th, 36th, 45th, 54th, 63rd, 72nd and 81st.`,
  
  
      magneticAttraction: `If you were born on either the 9th or 18th of February you will be attracted or influenced by persons born on the series of "eight" and "nine": if born on February 27th, you will be attracted by persons born on the series of "three" and "nine" in any month of the year.`
           }
       }
   },
    march: {
    generalInfluence: `The zodiacal influence for the month of march in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Pisces commences on February 19th , but for seven days, being overlapped by the "cusp" of the previous Sign, it does not come into full power until about February 26th .
  From this date onwards it is in full strength up to March 21st , when it meets the commencement of the "cusp" of the incoming Sign of Aries.`,
    generalCharacter: `People born in this part of the year, namely from February 19th to March 21st and in the "cusp" to March 28th , possess an innate "natural understanding" and intuition.
  They absorb knowledge easily, especially of the history of countries and people, and as well as matters relating to travel, exploration of lands research exploration and such like things.
  They are more mentally ambitious than they appear to be in the ordinary way, but they feel they must know their subject thoroughly before they speak or write about it.
  They have great loyalty to friends or to any cause they take up, provided they feel they are trusted or looked up to.
  They are generally successful in all position of responsibility, but at the same time are not inclined to push themselves forward and usually "wait to be asked" before giving their opinions.
  They are great respecters of "law and order" and uphold the conventions of whatever special order in which they may be found.
  The strongest and weakest characters are found in this Sign.
  Some are inclined to gratify their innate sense of luxury and self- indulgence, and if this side of the nature is the one that controls, they are likely to be too easy going, to be too receptive to their surroundings, to become influenced by false friends, to give way to fraudulent schemes and in some cases are inclined to become addicted to drugs or drink.
  If, however, persons born in this part of the year find some purpose worth living for, they rise to the emergency as few others can, These are the people that one meets sometimes in life who surprise their friends by their sudden change in character.
  They can, in a moment, throw off any form of weakness of self indulgence and rise to any height of self-denial.
  All persons born in this part of the year have a dual element as the mainspring of their nature.
  It simply depends on which of the two roads they have decided to follow.
  Persons born in this Sign are highly emotional.
  If they belong to the weak side of it, they are easily influenced by the people with whom they are thrown in contact, but if they belong to the stronger side, their emotional nature can lift them up to any position.
  They are generally fond of travel, of the ocean and large expanses of water.
  If circumstances do not permit them to travel, they will if they possibly can, make their homes where they can see the ocean or live on the side of some lake or river.
  In business they are good in dealing with transportation trade with foreign countries, imports and exports or seaborne commerce of any description.
  Almost all have a curiously mystical side to their nature, as well as the practical.
  They are often classed as superstitious: the occult in all its forms appealing to them in one way or another.
  They love to search out or investigate the unknown, the philosophical or the mysterious.
  Although by nature generous they have at heart a curious dread of poverty and for that reasons do not allow their generous instinct to get the better of them unless they are under the influence of someone they love.
  In such a case they become easily influenced and are likely to give away all they possess.
  Money has no value in their eyes.
  It is something to be used, or as a means to an end and nothing more.`,
  
  
    generalHealth: `Health: In health their greatest danger is more mental than physical; worry break down persons in this Sign more easily than those born in other parts of the year.
  Through being over-anxious they often bring on despondency and melancholy whit impairs the digestive organs, inclining them to nervous disorders and in many cases to paralysis.
  The lungs are also likely to be delicate; they are more inclined to get attacks of consumption than any other class.
  The skin of the body exudes perspiration easily, especially the hands and feet.
  Growths and tumours in the intestines are also typical diseases of this Sign.`,
  
  
    generalFinance: `Finance: From February 19th to March 1st the Sun is entering to the Sign of Pisces whose ruler is Jupiter (Negative).
  From February 19th the influence of Saturn is dying out and every day to March 21st the influence of Jupiter is increasing and becoming more beneficial.
  Persons born between February 19th to March 21st appear to be able to make a great deal out of their lives provided their ambition is awakened.
  We must, however, bear in mind that as the influence of Jupiter in this part of the year is in its negative House in the Zodiac it is more the mental side of the ambitions that are called into being.
  Persons born in this period will consequently be more ambitious mentally than physically.
  They will dream great dreams of what they want or expect themselves to be and often lack the continuity of purpose or physical effort to achieve their results.
  It is, in consequence, what might be called an uncertain Sign for finance and many "ups and downs" of fortune will threaten persons born in this period unless they have schooled themselves to follow out their ambitions to a climax.
  If persons born in this period of the year have mastered their natural inclination towards lack of continuity of purpose there is no position in life they may not attain for great opportunities will be given them from time to time.
  They will, however, be more or less careless in money matters and not inclined to save up for a "rainy day".
  They are often found to "waste their substance" and face poverty and loss of position in their advancing years.
  If they have been lucky enough to have been born on what may be described as "a strong date" in this period of the year, then all is well and they will be likely to cany out their dreams whether they relate to position or finance.`,
  
  
    generalMarriage: `Marriage, Unions, Partnerships, etc.: If you were born between February 19th to March 20th you will find your most harmonious relationship with persons born in your own Sign of Pisces, Third House of Water, February 19th to March 20th , June 21st to July 20th , Cancer, First House of Water, or October 21st to November 20th , Scorpio Second House of Water, and in the seven days of the "cusp" at the beginning or ending of each of these periods.
  You are also likely to be attracted to persons born in the part of the year opposite to your own.`,
  
  
    numbers: {
     1: {
     character: `Persons Born on March 1st , 10th , 19th , 28th Number 1 people in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the Sun and Uranus in the Zodiacal Sign of Pisces 5, House of Jupiter (Negative) Third House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in previous pages for persons born in March, but the Sun and Uranus will make your life an eventful one and bring you much publicity.
  The planet Uranus takes eighty-four years to make one revolution of the Zodiac.
  It forms a beneficial aspect to the Sun, as near as can be calculated, every fourteen years.
  It has a very powerful influence on persons born on the above dates in the House of Jupiter.
  If you were born on one of these dates no matter what your age may be, you come under a very important cycle of this planet starting during 1927 and lasting until about October of 1941.
  This period would bring great changes in your life and plans, causing removals from place to place, likely long journeys and a drastic change in your method of living, which in the end should turn out in your favour.
  Your nature under this influence of Uranus and the Sun will make you psychic and intuitive.
  It would consequently be well for you to follow your intuitions in regard to the changes and opportunities likely to occur during this period.
  It may, however, bring you much anxiety over money matters at the commencement, but the chances will be in your favour that things will turn out well.
  If born on the 1st , 10th , 19th or 28th of March, your career will be one of great possibilities, You will be enterprising and original in whatever you will engage in but inclined to be rather impetuous and headstrong in your actions.
  You should, as much as possible, develop patience and give yourself more time to think out your plans.
  You will incline to be over-optimistic, too hopeful, and rebel against delays or the difficulties that you will have to meet.
  You will slowly and surely develop a sense of power and self-confidence, which may have been missing in the early years of your life, and it will be well for you to develop this feeling.
  Although you have a strong love of home and home-ties, you will often find yourself at variance with members of your family, and you will be liable to losses, owing to their actions.
  Taking things all round, you can look forward to having a very eventful life, but one that will bring you success and prominence in the world wherever you live or in whatever your career may be.
  The 28th of March, being the first "Number One" in the next Sign of Aries, House of Mars (Positive) gives a still more favourable promise of success than the 1st , 10th or 19th of March.
  The Sun is in its "exaltation" in this part of year.`,
       finance: `Finance: If you were born on any series of the "number one" in March such as the 1st , 10th , 19th or 28th , you will, as a rule, be fortunate in money matters.
  You will get unusual opportunities for success, especially in such things as being put into responsible positions in business and as the head of large enterprises.
  You will have considerable foresight and vision and should follow your own intuition in such matters.
  Your greatest difficulty will be in trying to "play second fiddle" to anyone above you.
  As long as you can be the chief, all will be well, but your nature will be such a dominant one that it will be hard for you to get along in "double harness." As a rule, however, you will make money, but must expect many changes in whatever career you make your own.`,
       health: `Health: You will be endowed with a strong constitution and great vitality which your natural tendency will be to abuse and take "too much out of yourself." As your Sun is in the mental House of Jupiter, you will be inclined to mentally overwork yourself in endeavouring to carry out whatever your ambition may be.
  You belong, however, to the "hopeful class of individuals" and can never be kept "under" for long.
  You will exhaust your nervous energy at times and "run down" like a dynamo that has been overworked.`,
      importantNumbers: `Your most important numbers are the one hyphen four (1-4) and the "three".
  You should concentrate your efforts to carry out your plans on dates making these numbers or any one of their series, such as the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd , 28th , 30th and 31st .`,
      colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing the colours of your planets, which are.
  The Sun: All shades of gold; yellow, bronze to golden brown.
  Uranus: All shades of sapphire, dark blues and greys.
  Jupiter: All shades of violet, mauve or violet-purple.`,
      jewels: `Your "lucky" jewels are diamonds, topaz, amber and sapphire and all stones of gold or yellow colour, as well as those of sapphire blue shade.`,
      climactericYears: `The most important climacteric years in your life are the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd .
  28th , 30th , 31st , 37th , 39th , 40th , 48th , 49th , 50th , 57th , 58th , 64th , 66th , 67th , 73rd , 75th and 76th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or "four" in any month of the year, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st , also persons born in the series of the "three".`
     },
  
  
     2: {
     character: `Persons Born on March 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology you come under the vibration of the Moon and Neptune in the Zodiacal Sign of Pisces, House of Jupiter (Negative) Third house of the Triplicity of Water.
  The foundation of your character and disposition is described in previous pages for persons born in March, but the Moon and Neptune will be inclined to increase the imaginative and artistic tendencies indicated.
  To make the best out of your talents you should develop your will power and determination and stick to some one set purpose and abandon everything else for it.
  If you do this, you will have every promise of success, but more especially so if you can follow your artistic instincts.
  Your nature being a peculiarly sensitive one to your surroundings, you should make every possible effort to get into harmonious conditions and you would find it better to have a small home of your own than to live in a palace with persons that jar on your nerves or discourage you.
  You will deeply appreciate beauty of scenery, effects of colour and harmony of sound.
  You will be redress mentally, particularly of the romantic poetic kind, and you should do extremely well in all artistic work, such as painting, music, the cinema or theatre, writing, or any form of art.
  You will be very respective to psychic conditions and have decided gifts of inspiration, accompanied by dream of an unusual order.
  Perhaps on account of your unmaterialistic tendencies you will have a difficult time in your early years to make money.
  If born on march 29th , this date being already in the next Sign of Aries, it will cause your life to be still more eventful.`,
       finance: `Finance: Financial matters will be more or less uncertain.
  You will be inclined to make money in fits and starts, but you will seldom be able to keep a hold on it, unless you have deliberately developed caution and prudence.
  Your ideas will be inclined to be too large for your powers of execution and investments you make will not be liable to give you security or peace of mind.`,
       health: `Health: In matters of health you will be a puzzle to all who know you.
  With you everything relating to illness is mental.
  If you are happy and contented you will be well.
  If in unhappy surroundings you will be ill and not all the medicine in the world will effect a cure.
  Your principal tendency is towards malnutrition poorness of blood, bad, circulation and a general weakness of the spine, lumbar region and kidneys, all depending on whether you are in a depressed mental condition or not.`,
       importantNumbers: `Your most important numbers are the "two", representing the Moon; the "seven" representing Neptune; and the "three", representing Jupiter.
  You should make every effort to carry out your plans or engagements on dates that make these numbers or any of their series, such as the 2nd , 3rd , 7th , 11th , 12th , 16th , 20th , 21st , 25th , 29th , and 30th .
  If you were born on March 29th , the "nine" and its series takes the pace of the "three".`,
       colors: `To increase you magnetic vibrations and so make yourself more fortunate, you should wear or have in some part of your clothing, the colours of the Moon, Neptune and Jupiter, which are: The Moon: All shades of creams and pale greens.
  Neptune: All shades of dove-greys from the lightest to the darkest.
  Jupiter: All shades of violet, mauves and purple-violet.
  If you were born on march 29th , the colours of Mars crimson, red and rosetake the place of Jupiter colours.`,
      jewels: `Your "lucky" jewels are green jade, pearls, moonstones and opals; also the amethyst.
  If born on March 29th use rubies, garnets and red stones in place of the amethyst.`,
       climactericYears: `The most important or climacteric years in your life are the 2nd , 11th , 20th , 29th , 38th , 47th , 56th , 65th , 74th ; 7th , 16th , 25th , 34th , 43rd , 52nd , 61st , 70th ; 3rd , 12th , 21st , 30th , 39th , 48th , 57th and 66th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons making a "two" or "seven" in any month of the year, such as the 2nd , 7th , 11th , 16th ,20th , 25th and 29 th .
  Also those born on the one and four series, such as the 1st , 4th , 10th , 13th .
  19th , 22nd , 28th and 31st .`
     },
  
  
     3: {
     character: `Persons Born on March 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any one of the above dates, following the rule of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Jupiter in the Zodiacal Sign of Pisces, House of Jupiter (negative) Third House of the Triplicity of Air.
  The foundation of your character and disposition is that previously described for persons born in March, but coming so directly under the influence of Jupiter, the general indication will be favourable and promising.
  If born on one of the above dates you are under what is called a "double Jupiter" which, in this case, is a very powerful combination.
  It will give you never rest until you have achieved your purpose.
  You will succeed in life to have control over others and have all the elements to make a distinct success in whatever career you may follow.
  You will be lucky with partners and associates, provided you are absolute head of the concern.
  You will be almost equally practical and idealistic at the same time, with great ideas of philanthropy and humanity to man.
  You will become interested in large institutions, such as schools, colleges, hospitals, and should you become wealthy, you will leave large sums to charities of all kinds.
  You will be always ready to help the sick, independent of creeds, and you may look for forward to gaining honors in whatever community you may belong to.
  You will be fortunate in associations with large concerns, especially those engaged in industry, mining, the opening up and development of land, transportation and possibly shipping.
  If you were born on March 30th , which represents Jupiter in the next Sign of Aries, it will be still more favourable for your success.
  If born on any of the dates making the "number three" in this period of the year, such as the 3rd , 12th , 21st , and 30th , you will have a natural intuition about things and people which you should endeavour to be guided by in all your transactions.
  You will be hospitable, but unassuming in such matters.
  You will be fond of animals, out of door sports, and will develop great independence of character.`,
       finance: `Finance: You will be ambitious to make money, but very careful of your name and reputation.
  You will gain by solid enterprises and have every likelihood of becoming wealthy.
  You will show an enterprising spirit in all you undertake and will rise to prominence and position in whatever your career may be.`,
      health: `Health: This question largely depends on your own outlook on life.
  As long as you can continue in active work you will keep well and in a healthy condition.
  If forced for any reason into inactivity, you will become pleasure-loving and indolent, inclined to put on flesh and let the reins of life easily drop from your hands.
  You may not be so successful in home or married life, largely due to your being too dominant in character and not understanding the "other person's" point of view.`,
      importantNumbers: `Your most important number is the "three" and all its series.
  You should try to cany out your plans and engagements on dates which make this number, such as the 3rd , 12th , 21st and 30th .`,
       colors: `To increase your magnetic vibration and make yourself still more fortunate, you should wear in some part of your clothing, the colours of your planet, which are: All shades of violet, mauve to violet-purple.
  If born on March 30th , and Mars with its colours of crimson, reds and rose.`,
       jewels: `Your "lucky" jewels are the amethyst, or stones with a violet or purple tinge, but March 30th adds the jewels of Mars- rubies, garnets and all red stones.`,
      climactericYears: `The most important or climacteric years in your life are the 3rd .
  12th , 21st , 30th , 39th , 48th , 57th , 66th and 75th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three" in any month of the year, such as the 3rd , 12th , 21st and 30th , also those born under the "sixes" and "nines," such as the 6th , 9th , 15th , 24th or 27th in any month.`
     },
  
  
     4: {
     character: `Persons Born on March 4th , 13th , 22nd , 31st Number 4 people in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Uranus, Jupiter and the Sun in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
  The foundation of your character and disposition is described in previous pages for persons born in March, but the influence of Uranus in this part of the year will be inclined to increase your unconventional or eccentric qualities.
  You are likely to meet a considerable amount of sorrows and afflictions in the earlier part of your life, difficulties with your relations, home life and relatives by marriage.
  People will be likely to take from your instead of giving to you, and you will have to rely on yourself in carrying out your plans.
  You will be original in your ideas and more or less unconventional in your views.
  You will be very independent in action and inclined to attract criticism in all you do.
  You will be strangely drawn to all mystical occult studies and psychical research, and should encounter unusual experiences in such things, but this side of your nature you will be inclined to keep to yourself.
  You should try to express your "soul nature" in art, literature and music, or in making purchases of antiques, paintings, etc.
  You will have visions, dreams, presentiments and keep intuition about people and things.
  You will be most prudent in all money transactions and should avoid rash speculation of all kinds.
  Your friends will be out of the ordinary.
  You will like very few persons and your desire will be to keep to yourself as much as possible.
  You will have a very earnest, but hidden leaning towards the investigation of unusual phenomena and psychical research, but will be more likely to employ others in such work than to go in for it yourself.
  On accent of your sensitive, retiring disposition, you will conceal your own experiences from the world at large.
  If you were born on March 31st , being in the Sign of Aries (House of mars, Positive) you will be more forceful in your methods, but more inclined to arouse opposition against you.`,
       finance: `Finance: Your extreme prudence and distrust of others will be your protection in financial matters.
  You will be more likely to inherit money or property than make it yourself, and if so you will endeavour to guard it carefully, rather than attempt to increase it.
  You could, however, be very successful in developing some gift in the form or art, literature, music or invention, or scientific research.`,
       health: `Health: In matters relating to health you will become your own doctor.
  You will develop peculiar views regarding diet and the right way of living.
  You will run the risk of being considered "a crack" in such things and will cause friction and annoyance, especially in your home circles, as you will be inclined to force your views on other persons.
  You are likely not to feel strong or robust but this will be largely due to a tendency to develop morbidness as you advance in life and to feel criticism too keenly.`,
      importantNumbers: `Your most important numbers are the four hyphen one series (4-1) combined with the "threes", and you should endeavour to cany out everything important to you on dates making these numbers, such as the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd , 28th , 30th , and 31st .
  If born on March 31st , the "number nine" of Mars will take the place of the "three" of Jupiter.
  You will attract into your life persons born on dates making the "four" and "eight" such as the 4th , 8th , 13th , 17th , 22nd , 26th , and 31st , and if born on March 31st the series of the "nine", as well, such as the 9th , 18th and 27th .
  Strange events will be more likely to happen to you on these dates than on any others.`,
       colors: `To increase your magnetic vibrations and make yourself more fortunate, you should wear in some part of your clothing, the colours of your most important planets, such as: Uranus: All shades of sapphire-blue and greys.
  The Sun: Gold, yellow, bronze to golden-brown.
  Jupiter: Violet, mauve and violet-purple.`,
      jewels: `Your "lucky" jewels are the sapphire, all dark blue stones, diamonds, the topaz, amber and the amethyst.`,
       climactericYears: `The most important or climacteric years in your life are the 1st , 4th , 19th , 13th , 19th , 22nd , 28th , 31st , 40th , 46th , 49th , 55th , 58th , 64th , 67th , 73rd .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or "four" in any month of the year, such as the 1st , 4th , 10th , 13th .
  19th , 22nd , 28th and 31st ; and if born on March 31st , those born on the 9th , 18th or 27th as well as the above.`
     },
  
  
     5: {
      character: `Persons Born on March 5th , 14th , 23rd Number 5 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Mercury in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Water Triplicity.
  The foundation of your character and disposition will be that described for persons born in March, but the influence of Mercury in this part of the year with the beneficent vibrations of Jupiter, will lessen any of the bad tendencies given in that description.
  You will be either a great success or a great failure, depending completely on whether you develop the strong side of your character or allow the weaker to dominate.
  If you develop the strong side, you will have uncommon intellectual gifts, great adaptability to any class of work that interests you, a versatile understanding of things in general, very ingenious and inventive, with a ready wit and a quiet way of turning difficulties to your own account.
  In money matters you will have good ideas in speculation, you will dearly like a gamble and will always be ready to take a risk.
  Money, however, will not remain in your hands, and you will have many financial "ups and downs".
  If the weaker side of the character is allowed to rule, you will stick at nothing long: you will be a "jack of all trades," but master of none.
  You will gamble with opportunities, money and position, and lose all in doing so.
  You will be inclined to self-indulgence of all kinds and ruin the good intellect you started with.
  If you develop the better side of your nature you will have a keen intuitive perception of people and things and a method of acquiring a vast store of knowledge.
  You will have a certain restlessness of mind which would be detrimental if you do not control it and develop concentration.
  Persons born on the 5th , 14th or 23rd of March as a rule change their residence frequently.
  They hate being ties down or to have to live in one home for any length of time.
  They are always ready to move or to travel and generally find some excuse for doing so.
  They are extremely versatile in knowledge and able to talk well on any subject that crops up in general conversation.
  I often find persons born on these dates have considerable financial ability and do well in such things, provided they do not let their large schemes get out of their control as was the case with Horatio Bottomley, born on March 23rd .
  Persons born under these combinations often show great inventive power, or bring forward new theories that startle the world, as was the case with Einstein, born March 14, and his theory of "Relativity".`,
      finance: `Finance: In spite of the brilliant talent, persons born on these dates are endowed with, they seldom die rich.
  Money seems to melt in their hands and they rarely, if ever, make provision for their advanced years.
  I have known some of the world-wide financiers born under these combinations in this period of the year, see their great schemes go to pieces long before they reached the end of their life.`,
        health: `Health: You will be inclined to suffer from "nerves", and to become irritable in the face of opposition.
  This you should endeavour to control, as it will be a detriment to any mental pursuit you may wish to develop.
  You will be also so versatile, that it will be very difficult for you to know where your talents really lie.
  All this will have a bad effect on your health and may threaten a nervous mental breakdown if you do not make an effort to keep your nerves under absolute control.`,
       importantNumbers: `If you were born on March 5th , 14th , or 23rd , your most important numbers are the "five" and the "three", and all their series, and you should try and carry out your plans on dates making these numbers, such as the 3rd , 5th , 12th , 14th , 21st , 23rd , and 30th .`,
      colors: `You will be adaptable to all colours, but light shades with a touch of violet or mauve will be the most suitable for you.`,
       jewels: `Your "lucky" jewels are diamonds and all glistening or brilliant stones.`,
      climactericYears: `The most important or climacteric years in your life are the 5th , 14th , 23rd , 32nd , 41st , 50th , 68th and 77th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" in any month of the year, such as the 5th , 14th , 23rd , also the 3rd , 12th , 21st and 30th .`
     },
  
  
     6: {
      character: `Persons Born on March 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Planet Venus, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
  The foundation of your character and disposition is that previously described for persons born in March, but because of the favourable influences of the combination of Venus and Jupiter in this period of the year, you are likely to escape any of the bad indications that may have been given.
  It will be your own fault if you do not make a success out of your life under such favourable influences.
  You will be attracted to the beautiful in all things.
  You will be a lover of music, painting, poetry, literature, sculpture, the fine arts and the theatre, and you could make a name in any one of these things.
  You will be emotional, extremely sympathetic to the call of suffering and if well off, you will give generously for the relief of others.
  You will make many friends and have great devotion shown to you.
  You will be fond of society and entertaining; a lover of ease, comfort and beautiful surroundings.
  As well as creative art, you would make money in any work or business dealing with what are called the "luxury trades", such as catering, entertaining, organizing banquets, high class restaurants, hotels or shops selling antiques or works of art of any kind, as well as in any of the artistic calling.
  You should fight against fits of indolence, self indulgence and extravagance and put aside money for your old age.
  You are likely to have many romances and love affairs, and you will be more or less changeable in matters of affection.
  There will be every likelihood of more than one marriage and unusual experience in married life.
  You will be most kind, charitable and generous in every way; very emotional, idealistic and romantic; extremely fond of society and entertaining your friends, a good host or hostess, but with a strong inclination toward extravagance.
  You will be likely to make some unusual marriage at some time in your life and have a great deal of trouble through time in your life and have a great deal of trouble through marriage and meet with much hostility from relatives by marriage.`,
      finance: `Finance: As a general rule you will be lucky in money matters.
  Money will come to you in unexpected ways, also presents and costly jewels.
  Owing to your naturally improvident disposition, you will run the danger of passing your advanced years in an impoverished condition unless you make up your mind to put money aside for "a rainy day."`,
       health: `Health: You will have a splendid healthy constitution during your early years, but you run the risk of ruining your health by luxurious living unless you keep yourself well under control.
  In your advanced years, you will be likely to suffer from some form of heart disease and high blood pressure.`,
       importantNumbers: `Your most important numbers are "sixes" and "threes" and all their series, and you should endeavour to carry out your plans on dates making these numbers, such as the 3rd , 6th , 12th , 15th , 24th and 30th .`,
      colors: `To increase your magnetic vibrations, and so make yourself more fortunate, you should wear in some part of your dress or clothing, the colours of Venus of Jupiter, which are Venus: All shades of blue, from the lightest to the darkest.
  Jupiter: Violet, mauve or purple-violet.`,
      jewels: `Your "lucky" jewels are the turquoise and all blue stones.`,
      climactericYears: `The most important or climacteric years in your life are the 6th , 15th , 24th , 33rd , 42nd , 51st , 60th and 78th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "six" or a "three" in any month of the year, such as the 6th , 15th , 24th , 3rd , 12th , 21st and 30th .`
     },
  
  
     7: {
      character: `Persons Born on March 7th , 6th , 25th Number 7 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, You come under the vibrations of Neptune, the Moon and Jupiter, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicty of Water.
  The foundation of your character and disposition will be that described for persons born in March, but the influences of Neptune and the Moon will increase the qualities described and bring the most unexpected episodes and events into your life.
  You will have high ideals and great ambitions, but rather inclined to live an independent unconventional life.
  You will be broad minded, but will have curious ideas about religion and must have your own way about looking at such matters.
  You will have a distinct bent towards investigation of the mysterious in nature, and will be likely to have vivid dreams and unusual inspiration in whatever your work may be.
  As this is not what may be called a worldly combination you should be very careful in dealing with money matters, although under some conditions, by following your intuition in business matters, you may become very rich.
  Your nature will be one full of contradictions.
  You will be both strong and weak at the same moment, Other person could easily lead you if they can touch your idealism, but you cannot be driven, for on such an occasion you would show the most obstinate determination even against your own interests.
  You will be artistic and imaginative and have the ability to succeed in painting, writing, music, the theatre and the higher arts.
  You will have fine inspirational faculties, but could best develop them in quiet surroundings where you are not disturbed by the influence of other people.
  It is very doubtful if marriage would be favourable unless one was contracted rather late in life, and then with a person sympathetic to your ideals.
  You will be philanthropic and charitable, very desirous of helping institutions who are occupied in humanitarian work.
  Even if circumstances should not allow you to develop your own artistic talents, you will willingly help artists, buy their works, or make gifts to art galleries if you have the money at your disposal.`,
      finance: `Finance: Financial matters as the result of your own mental efforts will be favourable to you.
  You will create money in whatever your line of work may be.
  You will be inclined at times to be over-generous or allow others to make financial success from your ideas.
  The accumulation of wealth will never be your only object in life.
  You could succeed in shipping products from one country to another, in gaining money in lands far from your place of birth, but especially in developing the inspirational side of your nature and by following your intuitions.`,
         health: `Health: You will not be as strong physically as you will appear.
  You will live under high mental tension and have at intervals, spells of fatigue and exhaustion difficult to shake off.
  You will desire change, love the sea and wide expanses of water.
  An ocean voyage would always set you up when run down or feeling ill.`,
      importantNumbers: `Your most important numbers are the "seven" "two" and "three" and all their series.
  You should do everything important for you on dates making these number, which are the 2nd , 3rd , 7th , 11th , 12th , 16th , 20th , 21st , 25th , 29th and 30th .`,
       colors: `To increase your magnetic vibrations you should wear the colours associated with your planets or at least have them in some part of your clothing.
  These colours are: Neptune: All shades of dove-grey, especially those known as "electric greys".
  The Moon: All shades of greens and creams.
  Jupiter: All shades of violet, mauve and purple-violet.`,
      jewels: `Your "lucky" jewels are green jade, moonstones, pearls, amethysts and purple stones.`,
       climactericYears: `The most important or climacteric years in your life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
       magneticAttraction: `You will find a strong magnetic attraction of persons born on dates making a "seven" or "two" in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , also persons born on the series of "one" and "four".`
     },
  
  
     8: {
      character: `Persons Born on March 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn and Jupiter, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
  The foundation of your character and disposition is that described for persons born in March, but the influence of Saturn in this part of the year will rather tend to increase the more serious side of your nature.
  The natural tendencies of the planetary combinations governing a birth on March 8th , 17th or 26th would be to make life very hard and difficult through the early years, but from about the 33rd or 35th year, there would be every likelihood of considerable improvement.
  Persons born on these dates often find themselves very much misunderstood and are likely to meet with much slander, calumny and discredit in the run of their lives.
  Such things are likely to be caused either from lack of money to enable you to carry out your plans and ambitions, from ties of relationship or association with others.
  If you were born on any one of the above dates you should brace yourself to meet many secret sorrows and disappointments which will be continually cropping up, but by the development of strength of will, determination and never letting go of your ambition, you run the chances in the end of surmounting all difficulties.
  You may expect to have heavy responsibilities placed on your shoulders, and you will have difficulty in holding situations or positions, not because of lack of ability on your part, but on account of circumstances likely to crop up to rob you of merit and reward.
  If you should marry early, you are likely to bring on yourself restricting conditions either caused by home ties or very probably due to sickness or illness of the partner.
  Marriage is not likely to be a very happy experience unless you accept it from a philosophical standpoint.
  The chances are that you will play a marked role in whatever your career may be.
  You will have the splendid quality of marking the best of everything, and will not allow the world at large to share in your trials and sorrows.
  Persons born on any one of these dates have an unusually strong sense of duty, also a deep love of home and family.
  They have high ideals, especially for the masses, and are often found associated with large plans for the uplift of humanity.
  "General" Bramwell Booth of the Salvation Army, born on March 8th , is a good example if this combination.
  Those born under the indications governing the 8th , 17th and 26th of March, no matter what their career may be, have an atmosphere of dignity and reserve as a sort of cloak to cover their own inner emotions.
  Such persons generally rise in life to high positions of respect and responsibility and often gain honours and reputation.`,
       finance: `Finance: As a rule persons born in the above combinations, rarely if ever regard wealth from a personal standpoint.
  They desire money for whatever the cause is they have at heart-and they generally gain it.
  If you were born on the 8th , 17th or 26th of March you should avoid rashness in your own personal expenditures and avoid speculative risks.
  Although having good intuition about what other people should do, you will not be able to give yourself the same good advice and are liable to be influenced by designing persons planning for their own advantage more than yours.
  You will be likely to meet with sudden reverses of fortune at all times in your life and should endeavour to keep a "nest egg" in reserve for the eventualities that may happen.`,
       health: `Health: Mental conditions will largely influence you in all matters of health.
  Any worry or anxiety will easily break down your resistance to disease, and cause you to have spells of melancholy and depression.
  You will be prone to falling a victim to long protracted colds, chills and weak circulation of the blood, especially if born on the 7th or 16th of March.
  You should live in dry climates and have as much outdoor life, travel and change as possible, or you will be liable to suffer with arthritis and rheumatism, especially in the region of the feet, ankles and knees.`,
        importantNumbers: `Your most important numbers are "fours", "eights" and "threes" and all their series, such as the 3rd , 4th , 8th , 12th , 13th , 17th , 21st , 22nd , 26th , 30th , and 31st .
  At least these numbers and dates will be continually coming into your life and generally associated with serious consequences.
  The number I would advise you to use, for your own personal advantage, is the "three" and all its series and such dates as the 3rd , 12th , 21st and 30th .`,
       colors: `You will very likely find yourself having a decided leaning toward wearing dark colours, but if you do I would strongly advise you to always have some touch of violet, mauve or violet-purple in your wearing apparel.`,
      jewels: `Your fortunate jewels are black pearls and black diamonds, but I would advise you to use the amethyst or sapphire with the other combinations.`,
       climactericYears: `Important or climacteric years in your life are the 4th , 8th , 13th , 17th , 22nd , 26th ," 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 67th , 71st , 76th , and 80th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four", "eight" or "three" in any month of the year, such as the 4th , 13th , 22nd , 31st ;8th , 17th , 26th and the 3rd , 12th , 21st and 30th .`
     },
  
  
     9: {
      character: `Persons Born on March 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars and Jupiter in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
  The foundation of your character and disposition is described in previous pages for persons born in March, but the influence of Mars in this part of the year will give you power to combat and overcome any of the bad indications given.
  It also will increase the robustness of your condition and help you to resist threatened illnesses.
  The influence of Mars in this part of the year" will, however, make you at times rash and impulsive in thought and action.
  You will be restless, making changes in occupation or career.
  You will be inclined to rush into new schemes without due thought.
  You should learn to control your temper, especially over little things and try to be tolerant with those around you and with those with whom you work.
  You will suffer a good deal from hidden enemies, from slander and false reports, and whether you deserve it or not, you will be inclined to be harshly and unjustly treated if you are drawn into litigation in any form whatsoever.
  In business schemes you will have to most careful of partners and associates, the tendency being for you to get the blame if anything should go wrong.
  You will be inclined to be too generous with money, also rash in speculations.
  You will be very ambitious, with an intense desire to make yourself independent, and for this reason you will strain every effort to accumulate riches and run risks in doing so.
  You will have great courage in trials and misfortunes up to a certain point, but if your courage should at any time fail you, you will be inclined to become gloomy, morose and irritable and take some course of action that you would afterwards regret.
  You will make friends easily with those in high positions, but with those in your own sphere, or those beneath you, you will be prone to make many bitter enemies.
  You are likely to have many hardships and disappointments in love or affection and have a considerable amount of trouble with any children you may have.
  At times you have a leaning to indulge in drink or drugs, it depends entirely on your will and ambition whether you keep yourself from this or not.
  You will be generous and free with money, but rather inclined to be too extravagant and wasteful.
  If you should engage in business or industry, you will rise to a position of authority, but may not be able to keep it on account of your tendency to make enemies.
  In any department of government life you would go far and would be likely to reach some position of great responsibility.
  You will have a very magnetic personality; you would meet with success in any form of public career such as a writer, speaker, preacher or as a leader in any big movement.
  The 18th and 27th of March are as a rule especially favourable dates to be born on.`,
      finance: `Finance: Unless you were born into a strong position regarding wealth you may expect to meet with many fluctuations of money in ordinary life.
  You would not be lucky in speculation or investments, but could always do better for others than for yourself.
  If possible you should buy an annuity for your advanced years for the simple reason that you will not have much desire to save money or put it aside for yourself.`,
       health: `Health: If you were born on March 9th , 18th or 27th , in your early years you will escape all serious illnesses, but in the run of the forties considerable changes are likely to take place in your constitution.
  If you study yourself carefully during this period, especially in matters of diet, you may be able to build yourself up for another period.
  If not, you will liable to experience many serious ailments, such as trouble with the liver and kidneys, stoppages in the intestines, weakness of the heart and much experience of the surgeon's knife.`,
       importantNumbers: `Your most important numbers and dates are "nines" and "threes" and you should endeavour to carry out your plans on dates making these numbers, such as the 3rd , 9th , 12th , 18th , 21st , 27th and 30th .
  Unfavourable dates for you are "fours" and "eights" and all their series, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .`,
       colors: `The colours most suitable for you are : Mars: All shades of crimson, reds or rose.
  Jupiter: All shades of violet, mauve or violet-purple.`,
      jewels: `Your "lucky" jewels are rubies, garnets, bloodstones and amethysts.`,
       climactericYears: `The most important or climacteric years in your life are the 9th , 18th , 27th , 36th , 45th , 54th , 63rd , 72nd and 81st .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "nine" in any month of the year, such as the 9th , 18th , 27th and in a secondary degree with those born on the series of "threes" and "sixes", such as the 3rd , 6th , 12th , 15h, 21st , 24th and 33th , also with those born on the 1st , 10th , 19th or 28th .`
           }
       }
   },
    april: {
    generalInfluence: `The zodiacal influence for the month of April in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The zodiacal Sign of Aries, which governs the month of April, commences on March 21st , but for seven days being overlapped by the "cusp" of the previous sign it does not come into its full power until about March 27th .
  From this date onward it is in full force until April 19th .
  It is then for seven days gradually losing strength on account of becoming overlapped by the "cusp" of the incoming sign of Taurus, "House of Venus".`,
  
  
    generalCharacter: `People born in this part of the year, namely from March 21st to April 19th and in the "cusp" to April 26th , are endowed with strong will power, determination and obstinacy of purpose.
  They are born fighters in every sense of the word.
  They have, as a rule, great ability as organizers, either in large business or in the organization of large masses of people.
  They are intensely independent in work and must have things done their own way.
  If subjected to interference they often "step out" and let "the other fellow" take their place.
  As far as material success or power is concerned, there are no heights, persons born in this Sign cannot reach-provided they "keep their head".
  Success, however, is often their undoing, praise and flattery are inclined to make them have "swelled heads".
  In such conditions they do not "see straight" and by obstinate, arrogant actions in many cases bring about their own undoing.
  They are endowed with great mental energy, fully of new schemes and original plans for anything they are interested in.
  They are self- willed and nothing but hard facts and reason will make them see things in any light but their own.
  They are inclined to lack caution, being by their nature impulsive and quick in thought and action.
  They generally go to extremes in all things, are too frank and outspoken and inclined to make enemies by want of tact.
  They are extremely ambitious; as a rule they succeed in life and either amass money or gain positions of responsibility.
  The lower type of this Sign will stick at nothing to accomplish their purpose.
  As masters they are brutal and tyrannical and often meet a violent death.
  The higher types are good masters, but at the same time severe in discipline and more or less exacting in the service they demand from others.
  Both classes have a distinct desire to peer into the future, perhaps because they are impatient for things to develop.
  They are inclined to prophesy what will take place and often are very gifted in this direction.
  They desire to be looked up to and regarded as "the head", both in their homes, in their businesses and in their careers.
  As a general rule the men born in this part of the year suffer a great deal through their affections; they seldom understand women and often make great mistakes in their relationship with them.
  For both sexes their greatest happiness come from work and the overcoming of obstacles.
  This part of the Zodiac, the House of Mars (Positive), is also called the "House of Exaltation of the Sun," which helps to focus all the fire, energy and fearlessness of the planet Mars upon the character and destiny.
  Mars, the ancient symbol of War and Action, strongly influences persons born in April, Making the combative element predominate.
  As a rule they fight their way through all obstacles, countering many dangers and experiencing many changes in their life and careers.
  Essentially positive, forceful and heroic, the character is one of exceptional strength; they are as a rule optimistic in times of adversity and rise to the call of almost any emergency.
  If really aiming at success they should restrain their impulsiveness, for there is a strong tendency to rush recklessly into the fray without questioning the justice of the dispute; thus they frequently fight on the wrong side.
  Their decisions are generally made on impulse and the ultimate invariably sacrificed for the immediate.
  It is not exactly a want of foresight, but the desire of the moment that inclines to carry them away.
  At the same time, thought it may seem paradoxical, they are born leaders, organizers, practical, enterprising and ambitious, always in the van of progress and the first to support a new idea.
  Their natures revolt against all forms of convention and discipline.
  Their domestic life, as a general rule, does not turn out very happily unless they have the good luck to meet a partner who readily gives in to their plans and wishes.
  But, as far as material success is concerned, there is no height such persons cannot attain through their determination, executive ability and splendid powers of organization.`,
  
  
    generalHealth: `Health: The strong influence of Mars in such persons lives, gives them a magnificent physical store of health and energy, though their very excess of vitality is danger and most of their maladies will be induced by overwork.
  Their headstrong tendency to cany an enterprise through in wholly adverse circumstances or at an unsuitable time, is responsible for frequent disappointments, which result in irritation and impatience, including brain fag or nervous exhaustion, which may be the precursors of gastric and stomach derangements.
  They cannot be too careful in their habits and should live quietly, never exceeding temperate limits.
  They will always be more or less liable to feverish or inflammatory troubles.
  They should take vigorous daily exercise in the open air and avoid taking alcohol or any exciting drugs for their emotional nature wants controlling instead of stimulating.
  Everything connected with the head is inclined to suffer more than any other part of the body; pain in the teeth, ears and eyes, rushes of blood to the head, headaches and danger of apoplexy.
  Persons born in this Sign seldom get through life without receiving cuts, wound's or blows to the head, either from accidents or violence.
  They are also much inclined to suffer from the stomach, kidneys and liver.
  They are liable to gall stones, and trouble with the bladder and usually have a great deal of experience of the surgeon's knife.`,
  
  
    generalFinance: `Finance: Persons born in April, being governed by the planet Mars, in the House of "the exaltation of the Sun," have usually good earning ability, but tend to large or extravagant ideas in monetary matters.
  They can be very practical where the management of others is concerned, but there is a strong tendency to impulsive action in all important matters and they are apt to rush recklessly into any big financial scheme that presents itself to their notice.
  Owing to their innate lavishness and large ideas, they are often liable to sudden and heavy losses and fluctuation of fortune.
  They are very determined in the acquisition of wealth, but they gain more by judicious investments, industry and business than by actual luck.
  Persons born in April are much inclined to be involved in litigation and quarrels that promote law suits and in such matters, as a general rule, they are not fortunate.`,
  
  
     generalMarriage: `Marriage, unions, partnerships, etc.: They will find their most harmonious relationships with persons born in their own Sign (Aries), March 21st to April 19th , 1st House of Fire.
  July 21st to August 20th the Sign of Leo, 2nd House of Fire.
  November 21st to December 20th Sign of Sagittarius, 3rd House of Fire and in the seven days of the "cusp" at the beginning or ending of each of these periods; also persons born in the part of the year the exact opposite of their own in this case the 21st of September to the 21st of November.
  It must be borne in mind that from October 21st to November 21 st- 28th is the House of Mars (negative), which is the reason that persons born from March 21st to April 19th -27th (Mars Positive) are generally much attracted to those born under mars (Negative).`,
  
  
    numbers: {
     1: {
     character: `Persons Born on April 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Sun and Mars (Positive), in the Zodiacal Sign of Aries, first House of the Triplicity of Fire.
  This is a very powerful combination which should enable you to carry out your plans and ambitions to a successful issue.
  The basic foundation of your character and disposition is described in preceding pages for persons born in April.
  In your special case all the stronger qualities will make themselves manifest even early in your career.
  You will be highly creative and original in your plans and have great fearlessness and determination of purpose.
  You will be decidedly ambitious.
  You will rise above your fellows and are likely to become the most prominent member of your family or among your relations.
  You would be more successful without partners than with them.
  You will detest restraint of any kind, be a law unto yourself and will in consequence make many enemies in fighting your way through the battle of life.
  You will be extremely generous if allowed to have your own way, but as hard as iron if opposed, or if anyone should try to take any advantage of you in even the smallest way.
  You will crave for love and affection, but find it the hardest thing to gain, unless you meet those who fit in with your ambition.
  You will be likely to have disputes with any children you may have and in domestic matters.
  You will have an intense longing for outdoor life and a love of sport in all its forms.
  You should, however, be extremely careful in all matters of carrying guns.
  You will also run considerable risk from fire, explosions, motor car accidents and such like.`,
      finance: `Finance: You will have many "ups and downs" in money matters, but chiefly owing to your own rashness and in attempting enterprises beyond your power of execution.
  Owing to your magnetic nature you will have great influence over others, especially your opposite sex.
  You would make a successful company promoter, preacher, orator, organizer, or in any carreer that would bring you before the public.`,
      health: `Health: In health you should have great vitality and a splendid constitution, although you will at times undermine it by over-strain and overwork.
  Your greatest danger will come from high blood pressure, heart disease or apoplexy.
  You should endeavour to keep on a simple diet and above all thing avoid the use of alcohol and strong stimulants of any kind.`,
       importantNumbers: `Your most important numbers and dates are the "one" and "nine" with all their series.
  You should endeavour to carry out your plans on dates making these numbers, which are the 1st , 9th , 10th , 18th , 19th , 27th and 28th .
  You may find the numbers of "four" and "eight" and their series being drawn greatly into your life, but these it would be better to avoid as much as possible, such numbers as the 4, 8, 13, 17, 22, 26 and 31st , or accept them as warnings and act accordingly.`,
       colors: `To increase your magnetic vibration and so make yourself more fortunate, you should wear the colours relating to the Sun an Mars, which are: Sun: All shades of gold, yellow, orange to golden brown.
  Mars: All shades of red, crimson and rose.`,
      jewels: `Your "lucky" jewels are topaz, amber, diamonds and red stones, such as the ruby and garnet.`,
      climactericYears: `The most important or climacteric years in your life are the 9th , 10th , 18th , 19th , 27th , 28th , 36th , 37th , 45th , 46th , 54th , 64th , 72nd and 73rd .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one", "four", "eight" or "nine" in any month of the year, such as the 1st , 4th , 8th , 9th , 10th , 13th , 17th , 18th , 19th , 22nd , 26th , 27th , 28th and 31st .`
     },
  
  
     2: {
     character: `Persons Born on April 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Moon, and Neptune with Mars (positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in previous pages for persons born in April.
  The combination of planets under which you were born, will give you a character full of contradictions, one with great individuality, will power and determination, but largely swayed by the imaginative and romantic qualities.
  You will have original and unconventional ideas, with much imagination for creative and inventive work.
  You will resent being tied down or hampered in any way and will be inclined to rebel against restrictions and conventionalities.
  You will be likely to experience a great amount of trouble in your domestic life unless you overcome the romantic desires of your nature.
  You will be an enthusiast in everything you attempt, but rather inclined to carry your own opinions too far for your ultimate good.
  You will have many changes in occupation, not being tied down to one particular branch of work, but you will never be satisfied with any position you may acquire.
  Marriage is not likely to turn out well unless you control your emotions and complex yourself to settle down to a conventional life.
  You will be forceful, masterful and self-reliant in all positions of authority over others.
  You will stand out as a dominant leader, especially if you take an interest in political life or in military organizations.
  In such things you would be aggressive in your manner of speech or in writings, but at the same time you would command a large following.
  In business or industry you would aim to become the head and would be noted for your originality of ideas.`,
      finance: `Finance: In financial matters you would have weight and authority and be successful in earring out your own plans if not hampered by partners.
  If you developed your abilities as a writer or artist would also gain fame and considerable renown, but in whatever you may do you will stand out as a "forceful personality."`,
      health: `Health: In health you will have a robust constitution, would be prone to taking "too much out of yourself" in periods of exaltation and enthusiasm.
  You will be liable to have fevers and disorders of the blood, causing boils and eruptions on the head, face and body.
  You will be subject to many experiences of the surgeon's knife in various parts and to have danger from the intestines.
  You will have to guard against such things as trouble with the teeth, the gums, the nose, throat, the ears, mastoids and the sinus passages.
  You will meet with many accidents, have danger to your life from enemies and will run the risk of assassination or a violent death.`,
       importantNumbers: `Your most important numbers and dates are the "twos", "sevens" and "nines" and all their series, such as the 2nd , 7th , 9th , 11th , 16th , 18th , 20th , 25th , 27th and 29 th .
  You should endeavour to attempt your plans on any of these dates.`,
       colors: `To increase your magnetic vibrations you should wear in your clothing at least in some part, the colours belonging to your main planets, which are The Moon: All shades of green and white.
  Neptune: All shades of greys.
  Mars: All shades of red, crimson and rose.`,
      jewels: `Your "lucky" jewels are green jade, moonstone, cat's eyes, opals, pearls, rubies, garnets and all red stones.`,
       climactericYears: `Your most important or climacteric years are the 2nd , 7th , 9th , 11th , 16th .
  18th , 20th , 25th , 27th , 29th , 34th , 36th , 38th , 43rd , 45th , 52nd , 54th , 61st , 63rd , 70th , 72nd and 81st .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "two" or "seven" in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .
  If your were born on April 29th , you will be at the commencement of the incoming Sign of Taurus whose Ruler is Venus.
  This will soften the qualities given by the 2nd , 11th and 20th of April governed by Mars.
  It will make you more magnetic to others, less aggressive in manner, but ore likely to have complications brought along by your opposite sex.`
     },
  
  
     3: {
     character: `Persons Born on April 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Jupiter with Mars (Positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in previous pages for persons born in April, but this combination will make you more than usually ambitious and determined to rise in life and to succeed in whatever your purpose may be.
  You will be successful in all positions of authority over others, very definite in your opinions and rather dictatorial in your views.
  You will be good in organization, management and control of others; just and severe in the administration of law, even to the sacrifice of your own relations if necessary, for the sake of example to others.
  You will make powerful enemies and equally powerful friends.
  You will be exceptionally independent in your character and will resent being placed under compliment or obligation to anyone.
  In your domestic life you must be the "head of the house" in every sense.
  If not, there will be considerable trouble and friction.
  In many ways you will lead a "charmed life" escaping accidents and dangers that would destroy others.
  You will be what might well be described as both progressive and aggressive, but with high motives for the general good.
  You will aim to gain social standing in whatever community you live in.
  You will make influential friends in high positions and yet display large heartedness and kindness to ward the lower elements of humanity.
  You will be given positions of responsibility and may be drawn to fill government offices at some time in your life.
  If you went in for the Army and Navy you would rise rapidly and gain honours.
  You will be likely to fill two positions in the run of your career; one your own particular business, the other in municipal affairs of government work.
  You would make an excellent judge on account of your natural balanced judgment and your innate desire to see fair play to all.
  You will have a very decided love for literature, science and deep study and everything that can develop your mental powers.
  You will be a pioneer in your desire to develop new ideas for the general improvement of conditions, especially in relation to the masses and public.`,
      finance: `Finance: In matters of finance you will be fortunate and will be likely to acquire considerable wealth.
  You will be careful in speculation, investing your money in solid concerns and in building up industry and business.`,
      health: `Health: You will have a robust, vigorous constitution; be a lover of outdoor life and sport of every kind, but will run some danger of accident from animals, probably on account of your fearlessness in dealing with them.
  You will at times suffer from acute indigestion and stomach trouble, largely brought on by indiscretions in diet and perhaps by the many public banquets you will be obliged to attend.
  After middle life you are likely to put on flesh and develop trouble with the heart.`,
       importantNumbers: `Your most important numbers and dates are everything to do with the "three", "sixes" and "nines" or any of their series, such as the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th and 30th .
  The "number six" and its series will, however, although important, be likely to bring you much trouble if associated with persons who have "six" or its series for their birth numbers.
  You should make every effort to carry out your plans to meet persons important to you on the above dates.`,
       colors: `To increase your magnetic vibrations you should wear as a part of your clothing, the colours of the planets Jupiter, Venus and Mars, which are Jupiter: All shades of violet and mauve.
  Venus: All shades of blue from lightest to darkest.
  Mars: All shades of crimson, red or rose.`,
       jewels: ``,
       climactericYears: `Your most important or climacteric years are the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th , 30th , 33rd , 36th , 39th , 42nd , 45th , 48th , 51st , 54th , 57th , 60th , 63rd , 66th , 69th , 72nd , 75th and 81st .`,
      magneticAttraction: `If you were born on the 30th day of April you will be in the first degrees of the next Zodiacal Sign, the House of Venus.
  Your characteristics will be the same as to their foundation, but you will be kinder, more affectionate and more generous.
  You will find a strong magnetic attraction to persons born on dates making a "three," "six" or "nine" in any month of the year, such as the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th , and 30th .`
     },
  
  
     4: {
      character: `Persons Born on April 4th , 13th , 22nd Number 4 People in This Month If you were born on any one of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus, the Sun and Mars, in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in previous pages for persons born in April.
  This is a strong, but rather peculiar combination, causing you to meet with strange contradictions in going through life.
  You will have periods of success and periods of failure.
  The unexpected will happen more often than the expected.
  You will be a child of circumstances where Fate will play an important part.
  You will be likely to make many changes in your career and plans and feel restless and unsettled unless you can strike some one decided thing in which you can put your heart and soul.
  You will find great difficulty in making true friends and those you will make will be more or less peculiar and odd.
  You will be original and unconventional in your views and will form a religion and philosophy of your own.
  You will experience many enmities, have underhand enemies and meet with much opposition.
  You will not have an easy life at any time, as far as the material world is concerned.
  You should be inventive, also fond of machinery, but more especially that of the newer types, electrical devices of all kinds, radio, television and such like.
  You will have remarkable ideals, but rather of the philosophical order but there is a side in your nature that as a rule will bring you into conflict with others likely to cause you to have many disputes, estrangements with partners and litigation.
  You will not be a person that one can easily advise, as you will have a very personal way in looking at life, especially in dealing with the "children of your brain." You will be inclined to take the opposite view in any argument and you will not have sufficient tact to hide your resentment with those who do not agree with you.
  At times you will be brusque or blunt in your manner and may hurt people's feelings, but not meaning to do so.
  As a rule you will be much misunderstood, but so independent in character that you will not care whether you are liked or not You will be a great reader, with a deep love of good literature, with intense mental energy and activity in everything you do.`,
      finance: `Finance: You will not easily work with others, but could be very successful in carrying out your own ideas.
  In matters concerning money you will be prudent and cautious and in small things may get a reputation for being "close-fisted".
  You will be rather inclined to be over-anxious about the future and for this reason you will endeavour to make good provision for your advanced years.
  If a businessman, you will be likely to retire early in life from active work.`,
      health: `Health: In matters of health you will be very unusual.
  You will overwork with a superabundances of energy; at other times you will feel too listless to make any effort.
  Mysterious illnesses difficult to diagnose, are likely to affect you.
  Get back to nature and the simplest diet will be your salvation at such periods.`,
        importantNumbers: `Your most important numbers and dates are the "fours", "ones" and "nines" and all their series, such as the 1st , 4th , 9th , 10th , 13th , 18th , 19th , 22nd , 27th , and 28 th .
  You will find the number "eight" much brought into your affairs, also persons whose birthdays fall on this number or its series, such as the 8th , 17th and 26th .`,
       colors: `To increase your magnetic vibrations you should wear, in some part of your clothing, the colours of the planets of Uranus, the Sun and Mars, which are: Uranus: All shades of grey and what are called "electric colours".
  Sun: All shades of gold, yellow, orange to golden brown.
  Mars: All shades of red, crimson or rose.
  But if born on April 22nd , having come into the "cusp" of the Sign of Taurus you should substitute all shades of blue for those of red or crimson.`,
       jewels: `Your "lucky" jewels are sapphires and blue stones of that colour, topaz, yellow diamonds and amber; but if born on the 22nd you should use the turquoise and sapphire as much as possible.`,
       climactericYears: `The most important or climacteric years in your life are the 4th , 8th , 13th , 17th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 62nd , 67th , 71st , 76th and 80th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a four or eight in any month of the year such as the 4th , 8th , 13th , 22nd , 26th and 31 st .`
     },
  
  
     5: {
      character: `Persons Born on April 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury with Mars (Positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  This combination can be either very good or very bad, depending on the way you may develop your will power and general character.
  It can also be very lucky or the very reverse.
  If you were born on April 5th , 14th , or 23rd , your mind will be versatile, clever and intelligent, but should be well directed.
  If kept Under control of the higher aspirations there is nothing it cannot master or accomplish.
  You will be inclined to quickness or thought, speech and action; sharp in repartee and argument, but with good reasoning powers and mental adaption on almost all subjects.
  You will like all forms of new ideas, and inclined to be in active rebellion against conservative submission to convection.
  You will like all forms' of new ideas, and inclined to be in active rebellion against conservative submission to convention.
  You will be fond of reading and delving into histories, and will have remarkable memory for facts and dates.
  You would have great influence over others by the gift of speech or by the pen.
  If you develop your will power you will rise in life to some high position, but one having heavy responsibilities.
  Should you allow the worse side of your nature to have its way you will be attracted to evil companions, social extravagance, drinking, gambling, etc., and lead a dissolute life.
  You will attract intense love and devotion from others, but you will be impersonal in your own feelings and be rather aloof in matters of the affections.
  You will be likely to many more than once and to meet with considerable trouble in your domestic life.
  You will make enemies by your quick repartee and frankness of speech, but taking things all round you will have remarkable influence over others.`,
      finance: `Finance: In matters relating to financial prospects you will be largely the arbitrator of your own destiny, but the success of your work will come first in every way.
  If you belong to the higher plane which your natural gifts entitle you to occupy, you will always find the money you want for your purpose, but should you come under the lower influence of this Zodiacal combination in April, you will be inclined to undermine your splendid mentality by drugs, drink and loose living, and will gamble away your chances of the good opportunities that come your way.`,
       health: `Health: Your nervous system will be over highly strong by reason of your intensely active brain.
  You will run the risk of exhaustion if you do not study yourself as one would some intricate piece of machinery.
  At times you will be liable to experience a twitching of the nerves in the face or eyes, which will be warning signals of your over-taxing your mental strength.
  You will be liable to have trouble with the digestive organs and intestines.`,
       importantNumbers: `Your most important numbers and dates are the "fives" and "nines," and all their series, such as the 5th , 9th , 14th , 18th , 23rd and 27th .
  You should endeavour to carry out your plans on these dates.`,
      colors: `To increase your magnetic vibrations, you should wear light colours as much as possible, but with some touch of red, crimson or rose.`,
      jewels: `Your "lucky" jewels are diamonds and rubies, and all white or glistering stones.`,
       climactericYears: `Your most important or climacteric years are the 5th , 9th , 14th , 18th , 23rd , 27th , 32nd , 36th , 41st , 45th , 50th , 54th , 59th , 63rd , 68th and 72nd .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" in any month of the year, such as the 5th , 14th and 23rd .`
     },
  
  
     6: {
      character: `Persons Born on April 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus with Mars (Positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  This is a favourable combination, giving you a genial generous nature backed up by the energy and enthusiasm of the planet Mars.
  The basic foundation of your disposition and character is that described in preceding pages for persons born in April.
  Your nature will be affectionate, demonstrative, warmhearted and passionate, and greatly attracted toward your opposite sex.
  You will be popular socially, making friends wherever you go.
  You will be very charitably inclined, with your sympathetic nature responding quickly and impulsively to appeals for assistance from others.
  You will make use of money rather extravagantly and make a good show in your home and surroundings.
  The tendency will be to live too well, to enjoy the good things of life and to live up to or beyond your income.
  You will, however, be more lucky than otherwise, both in friends and money, but you should be careful to curb your generosity and not let it impoverish you.
  You will be likely to marry early, acting from impulse more than reason.
  An early marriage is not in your case inclined to harmony.
  A second marriage later in life would be more favourable.
  You should make a success in some artistic life, such as painting, music, sculpture, poetry or literature.
  You will be fond of the theatre and opera and should do well in such professions.
  You will make many friends and be extremely popular, but inclined to waste too much time and money in the entertainment of those you meet.
  You will be intensely fond of travel and keenly interested in the customs and habits of other nations.`,
      finance: `Finance: In matters of money you will be very lucky during the early years of your life, but due to your own extravagance and lack of provision for the future, there will be grave danger of your finding yourself in an impoverished condition long before the end of your days.`,
       health: `Health: In questions of health you will have a good constitution, quickly recovering from any illness, but you will be liable to suffer with afflictions concerning the head, such as delicacy of the throat, nose and ears and severe headaches.`,
       importantNumbers: `Your most important numbers and dates are the "six", "three" and "nine", with all their series, such as the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th , and 30th .
  You should endeavour to carry out your plans on these dates.`,
       colors: `To increase your magnetic vibrations you should wear the colours of your planets, Venus, Jupiter and Mars, which are: Venus: All shades of blue, from the lightest to the darkest.
  Mars: All shades of red, crimson and violet-purple.`,
      jewels: ``,
      climactericYears: `The most important or climacteric years in your life are the 6th , 9th , 15th , 18th , 24th , 27th , 33rd , 36th , 42nd , 45th , 51st , 54th , 60th , 63rd , 69th and 72nd .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three", "six" or "nine" in any month of the year, such as the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th and 30th .`
     },
  
  
     7: {
      character: `Persons Born on April 7th , 16th , 25th Number 7 People in This Month If you were born on any one of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon with Mars (positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  This strange combination will give you a very complicated character and produce a very unusual life.
  The basic foundation of your disposition and character is described in the preceding pages for persons born in April but in your case everything will be more accentuated.
  You will be greatly attracted to mystical, masonic and secret societies; also to occultism and psychic studies, and will be likely to investigate such matters.
  You will have a great love for music and will probably play some instrument remarkably well.
  You will have intense emotions and feelings and original ideas in connection with religion and social affairs.
  You are likely to be considered a "crank" or eccentric, by those who do not understand you, but you will gladly pursue your way all the same in spite of opposition.
  You will have an intense desire to travel and see countries far from your place of birth.
  Your greatest fault will be restlessness of disposition, and a continual desire for change in your surroundings.
  You might do exceptionally well in some artistic life, or one giving scope to your inventive imaginative abilities.
  In ordinary business you would have many changes but any life or routine would not be suitable to you.
  Neptune in this period of the year intensifies your emotions, but it is not a worldly or material aspect.
  You will therefore find it hard to settle down to any regular conventional life.
  You are likely to take an interest in organizations connected with benevolent institutions, and you might do well if you became associated with national or political work on such lines.
  You are liable to take strong aversions to many people you come in contact with and this quality in your disposition you should endeavour to control or it will cause you to be much misunderstood.`,
      finance: `Finance: The question of finance will be a very peculiar one of you.
  There will always be a likelihood of considerable uncertainty and fluctuation in money matters, but you will, at times, make or realize large sums of money by your inventive ideas.
  You will be inclined to live in a land of dreams and illusions with your opposite sex and meet with many disappointments.
  You should avoid all speculation and gambling of every kind.`,
      health: `Health: In health you will be liable to rapid changes in physical conditions, and be much influenced by your surroundings.
  You will be much subject to colds, chills, fevers, influenza and malaria, and will run down easily when there is any unusual tax on your system.`,
       importantNumbers: `Your most important numbers and dates will be the "sevens" and "twos" and all their series, such as the 2nd , 7th , 11th , 16th , 20th , 25th , and 29th .
  You should endeavour to carry out your plans or engagements on such dates.`,
       colors: `Your most fortunate colours are those of Neptune, the Moon and Mars, which are: Neptune: All shades of dove-greys and electric shades.
  Moon: All shades of green, cream and white.
  Mars: All shades of red, crimson and rose.`,
      jewels: ``,
        climactericYears: `Your most important or climacteric years of life are the 7th , 11th , 16th , 20th , 25th , 29th , 34th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "two" and "seven" in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th , 29th .
  Also those born on the 1st , 10th , 19th and 28th .`
     },
  
  
     8: {
      character: `Persons Born on April 8th , 17th , 26th Number 8 people in This Month If you were born on one of the above dates, such as April 8th or 17th , following the rules of Astrology and my system based on Chaldean Numerology, you come under the Vibration of Saturn with Mars (Positive), in the Zodiacal Sign of Aries, First House of the Triplicity of Fire.
  But if born on April 26th , this date being the first of the Number Eight series in the next Sign, Taurus, First House of the Triplicity of Earth ruled by Venus you will come under very different conditions than if born on the 8th or 17th .
  The 8th or 17th of April, under the vibrations of Saturn and Mars, is not a very favourable combination, unless you exercise great caution and prudence in all your actions.
  The basic foundation of your character and disposition is described in the preceding pages for persons born in April, only in your case the things indicated will be more emphasized.
  You will meet with great difficulties and obstacles to your ambitions during the first half of your life.
  You will be held back by ties of home and relations and are likely to have many people to support or care for.
  You will be very ambitious and rather chafe and struggle against the conditions of your life, but your greatest asset will be your dogged perseverance and determination.
  You are not likely to be lucky with partners in business or marriage, especially an early one.
  You will be liable to meet with considerable opposition and unhappiness.
  Late partnerships and late marriage would be more favourable.
  You will have remarkable ideas and plans for the starting of new industries and for the developing of business on a large scale.
  Your greatest difficulty will be to find others who will see with you "eye to eye".
  You will be likely to attempt things on big lines," but your persistency, great will power and determination are likely to carry you through in the end.
  Although you will not have any real love of money except as a means to an end, you will be tormented by the fear of poverty and so at times you may be considered "close-fisted" or mean by those who only judge on the surface.
  You will be extremely reserved, not trusting people easily, more or less suspicious of strangers and always inclined to keep "a card up your sleeve".
  You will be acquisitive, hoarding up things in closets and trunks that you may never use.
  The dates of the 8th or 17th of April generally produce, excellent doctors, surgeons, scientists, chemists or organizers of every description.
  If your born on April 26th , being at the commencement of the incoming Sign of Taurus, House of Venus (Positive) many of the qualities already mentioned will in your case be softened by the Venus side of your nature.
  When opposed you will "fight to the death" in defence of your views, but when the battle is over you will be most forgiving and repentant for hasty words you may have used.
  You will be inclined to lack patience with others and lose control over your temper on the least provocation.
  You are likely to be drawn into many law suits in the course of your life.
  As a rule you will have much worry and disappointment with lawyers and would do best in fighting your own battles.
  You are not likely to be fortunate in money matters until past middle life, but when it does come it will recompense you for what you have passed through.
  As the "cusp" of Taurus commences on April 19th , the seven days added to it brings April 26th to the first day of Taurus, the Bull First House of Earth, Consequently you should do well in the opening up of land, making money by its development, also in estates and house property.
  All Venus things will be favourable for you, such as the manufacture of perfumes, cultivation of flowers, trees or plants.
  You will also be extremely fond of music, painting and the decorative arts in general.
  Your chief faults will be extravagance in thought and action, the desire to cany anything out on a large scale, inclined to be too "bull- headed" and obstinate, to not know "when to give in" or to learn the lesson that "discretion is the better part of valour." Your life will be full of contradictions, born on April 26th on the ending of the "cusp" of Mars (Positive), and standing at the beginning of Venus (Positive), with Saturn as a powerful influence.
  You must expect what is called "a marked" life and to meet with much opposition in the carrying out of your plans.
  Persons born on the series of "fours" and "eight" on the four Cardinal Points of the Zodiac, which are April, July October and from the 22nd December to February 19th , will find the numbers of "fours and eights" of more meaning and importance in their lives than those born on the same series in other months of the year.`,
       finance: `Finance: Your obstinate perseverance and headstrong qualities will always be a great asset in your favour, but you will find very few persons, if any, that you can work easily with in "double harness".
  You will be more likely to be architect of your own fortune than receive much help from others, but there is no reason for you not to eventually succeed and even become wealthy.`,
       health: `Health: In health, if born on the 8th , 17th or 26th of April, you are likely to have some very peculiar experience such as the wrong diagnose of your ailments, wrong medicines prescribed for you and such like.
  You should studiously avoid drugs of all kinds, also wines or spirituous drinks.
  You should study your diet and keep your intestines in good condition or you will be liable to autopoisoning, boils, carbuncles, skin complaints, constipation and such ills, also some peculiar condition of Lie blood.
  You are liable to undergo many operations, especially those concerned with the jaws, teeth and bones of the head.
  You will be likely to have the tonsils removed early in life and experience delicacy in connection with the nose, throat, ears and lungs.`,
      importantNumbers: `You will find the numbers of "four" and "eight" inclined to come into your life with great significance, such as the 4th , 8th , 17th , 22nd , 26th and 31st .
  I do not advise you to deliberately select these numbers, or dates for your own purpose, but to make use of them as they come along.
  If you were born as late in April as the 26th you should use the numbers of Venus as much as possible, such as the 6th , 15th and 24th and those of the Sun, the 1st , 10th , 19th and 28th .`,
       colors: `To increase your magnetic vibration I would advise you to use the colours of the Sun as much as possible, and next to that those of Venus and Mars.
  The Sun: All shades of gold, yellow, orange, golden brown or bronze.
  Venus: All shades of blue, but especially those of the sapphire order.
  Mars: All shades of red, crimson or rose.`,
      jewels: `For "lucky" jewels wear diamonds, topaz, amber, rubies, garnets, red stones, sapphires and emeralds.`,
       climactericYears: `The most important or climacteric years in your life are the 4th , 8th , 13th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 62nd , 67th , 76th and 80th .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four" or "eight" in any month of the year, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .
  Also persons born on the 1st , 10th , 19th , 28th and if born on April 26th , as well the 6th , 15th and 24th .`
     },
  
  
     9: {
      character: `Persons Born on April 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars, in the House of Mars (Positive), with the exception of the 27th , which is under the influence of the incoming Sign of Venus.
  The basic foundation of your character and disposition is described in the preceding pages for persons born in April.
  In your case, however, if born on the 9th , 18th or 27th , the important high lights will be accentuated.
  The first of the number nine people born in this part of the Zodiac commences on March 27.
  You will be extremely independent in thought and action; have a strong dislike to all restrictions and limitations of any kind.
  You will be much inclined to express your views and opinions too frankly regardless of the feelings of others.
  You will be rather quick in temper, combative and rush into quarrels or arguments on the impulse of the moment.
  You will have a keen love of sport in all its forms and will seek adventure on every occasion.
  You will run great risks, be fearless in danger, exhibiting the true fighting spirit on all occasions.
  You would have talent for any form of military life and be ready at a moment's notice to volunteer for war if the occasion should offer.
  You will never get through life without meeting considerable danger from accidents, also from cuts, wounds, fires, explosions, firearms and surgical operation.
  You will be liable to have injuries to the eyes and upper portions of the face and head.
  You will love an outdoor life, and all forms of sport.
  You will be fond of animals, but run considerable danger from them.
  You will not easily subject yourself to other persons and would do best in some career where you could be your own master.
  You will have strong personal magnetism, be a general favourite with your opposite sex and have more than the average romances and love affairs.
  In spite of these tendencies, marriage would be favourable if you are lucky enough to meet with a partner who is ready to forgive your faults for your heroic qualities.
  At times you may give way to intemperance, but more because of your love of social intercourse than from the love drink.`,
       finance: `Finance: You will have great ability in making money in all forms of industry, business organization or in the employment of others.
  You will always see a way out of any difficulty and be self-reliant and determined in whatever course of action you may decide to follow.
  You will be fearless and courageous, but perhaps too headstrong for your own good.
  You will be a speculator on a large scale in all you undertake.
  You will treat life more as a game than from a serious standpoint.
  As a general rule, luck will favour you during the greater part of your life.`,
       health: `Health: You will be endowed with a splendid constitution and great vitality.
  You would recover quickly from any illness.
  Your greatest danger will come from accidents of all kinds, especially those caused by firearms, fires, explosions, street or road dangers.
  You will also have a liability for high blood pressure, heart disease and apoplexy.`,
       importantNumbers: `Your most important numbers and dates will be the "nine" and the "one", and all their series, such as the 1st , 9th , 10th , 18th , 19th , 27th and 28th .`,
       colors: `To increase your magnetic vibrations you should wear, in some part of your clothing, the colours of Mars and the Sun which are: Mars: All shades of red, crimson or rose.
  The Sun: All shades of gold, yellow, orange, bronze or golden brown, but if born on April 27th you could add to these the Venus colours, all shades of blue from the darkest to the lightest.`,
       jewels: `Your "lucky" jewels are the ruby, garnet, red stones, diamonds, topaz, and amber.
  If born on the 27th you can also use the turquoise and all blue stones.`,
      climactericYears: `The most important or climacteric years in your life are the 9th , 18th , 27th , 36th , 45th , 54th , 63rd and 72nd .`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a one or nine in any month of the year, such as the 1st , 10th , 19th , 28th , 9th , 18th and 27 th .`
           }
       }
   },
    may: {
    generalInfluence: `The zodiacal influence for the month of may in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Taurus, which governs the month of May, commences on April 19th , but for seven days being overlapped by the "cusp" of the previous Sign, it does not come to its full power until April 26th .
  From this date onwards it is in full force until May 20.
  It is then for seven days, gradually losing its strength on account of becoming overlapped by the "cusp" of the incoming sign of Gemini, whose ruler is Mercury (positive).`,
  
  
    generalCharacter: `Persons born in this part of the year come under the symbol of Taurus, the Bull, which is also called the House of Venus, (Positive).
  This is one of the Fixed Signs of the Zodiac, the First Triplicity of Earth.
  It bestows, as its name implies, fixed strong characteristics, great tenacity of purpose and obstinate determination.
  Persons born under its rule, after the 21st of May, lose a good deal of these headstrong qualities on account of their coming under the "cusp" of the approaching Sign of Gemini-the First Triplicity of Air.
  The earlier dates in May are consequently more positive in character than the latter ones.
  In some points of disposition this is one of the most contradictory of all the Signs of the Zodiac.
  Persons born in this part of the year, namely from April 19th to May 20th , and in the "cusp" to May 27th , have the characteristics of Taurus, the Bull, and are more or less plodding and patient, except when roused by anger or injustice.
  They are unyielding in their determination and are often called "bull-headed" and obstinate.
  If, however, love enters their life, they become the most easily influenced of all types, but only by that person who has aroused the affectionate side of their nature.
  They are noted for their power of endurance, both physically and mentally, and can stand any strain as long as their determination lasts.
  They are extremely social and are never happier than when entertaining their friends, or those they love.
  They make splendid hosts or hostesses; they have great taste about food, and in an emergency make excellent cooks.
  They are artistic in their homes, wonderful in their arrangement of furniture and making things appear well.
  They have a strong sense of dramatic appearance, they dress and "look the part" and can fill to perfection any role on life's stage they may be called on to play.
  As a rule they are often considered richer than they really are, and are more or less showy in everything they do.
  They are governed largely by their emotions and sensations, but affection has a greater hold on them than passion.
  The men of this type usually have broad shoulders, thick necks and large foreheads.
  The women have large breasts and, as a rule small hands and feet.
  If either sex, love, they are generous in giving to the last degree.
  They consider no sacrifice too great for the person they care for, but if they hate, they will fight with bull-headed obstinacy to the death.
  As a rule they fight honourably and openly, for this reason they often the worst of it at the commencement, but if their blood is once aroused they do not know what surrender means.
  They are peculiarly sensitive to their surroundings and often become morbid or melancholy when forced to live under poor or unfavourable conditions.
  Neither the men or the women in this Sign should many early; their first love affair or man-age is generally a mistake, but as a rule they develop early and many early.
  Both sexes are inclined to be jealous in their affections and their jealousy drives them into unreasoning acts or violent fits of temper which they bitterly regret when the passion is over.
  They forgive at the slightest show of feeling or kindness and this side of their nature makes them do all kinds of things that the world calls stupid.
  As leaders in any cause they inspire love and devotion and often have great responsibility forced upon them.
  They have an innate sense of harmony, rhythm and colour and often succeed well in music, poetry and art, but curiously enough they usually lack the "money sense" to make the most of their qualities or talents, except those born on certain dates which will be explained later.
  Those born in this Sign make the most faithful, loyal friends, also excellent public servants officials or heads in government positions, or in the Army and Navy.
  They also make good patient nurses, healers and almost all have a keen love of gardening, flowers and outdoor life.`,
  
  
     generalHealth: `Health: The Planet Venus, ruling this question for those born in this part of the year, gives an abundance of vitality, which should be guided into the proper channels and given out for the benefit of others, otherwise it is inclined to consume itself and develop morbid conditions.
  The chief danger to health in such cases, comes through inertia and self-indulgence.
  Some liability to dropsy may be likely towards the end of life therefore great discretion in diet is advisable.
  The kidneys, throat and generative system will be liable to disorders when health fails.
  Such persons should use temperance in all things and avoid indulgence in wines, strong drinks and over-rich foods.
  Persons born in this Sign of the Zodiac have a tendency to suffer with all things that affect the nasal cavities and upper part of the lungs.
  They are inclined to have inflammation of the throat, tonsillitis, diphtheria, polypus in the nose and nasal catarrh.
  Under the strain of over-work, the heart is more less affected; they have fainting spells for no apparent reason and often a tendency for "blood to the head" or apoplexy.
  Their flesh is easily bruised and they are liable to tumours and internal growths, especially if forced to live in damp places or wet climates.`,
  
  
    generalFinance: `Finance: As a general rule this is a favourable part of the year to be born is as far as the getting of money is concerned.
  This Zodiacal period of the year promises gain through cooperation, partnerships, associations as well as through marriage.
  The Venus influence of this part of the year, however, tends towards the generous love nature to be imposed on and some cruel experiences in helping others may be expected.
  A strong desire to get money and possess wealth is one of the underlying qualities of persons born in this part of the year, but this desire is actuated not so much from selfish reasons, but in order to be in a position to live well and help those they love.
  The women born in this part of the year generally "marry well" as far as money is concerned, but there is usually more than one marriage in the run of their lives.
  Women in this Sign often exhibit considerable business ability and power of organization, and yet with it ail, never losing sight of the artistic which is one of the basic characteristics of their nature.
  For both sexes everything to do with the opening up, exploiting and developing of lands, mines and minerals, appears to be especially in their favour.
  Building schemes, even the management of properties, such as hotels, restaurants and such like enterprises are also good and bring them success.`,
  
  
    generalMarriage: `Marriages, unions, partnerships, etc.: They will find their most harmonious relationships with persons born in their own Sign (Taurus) April 19th to May 20th , First House of Earth, August 21st to September 20th (Virgo), Second House of Earth.
  December 21st to January 20th (Capricorn), Third House of Earth, and in the seven days of the "cusp" at the beginning or ending of each of these periods.
  Also persons born in the month of the year the opposite to their own, in this case from October 21st to November 20th -27th .`,
  
  
    numbers: {
     1: {
     character: `Persons Born on May 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and the Sun in the Zodiacal Sign of Taurus, First House of the Triplicity of Earth.
  As the 1st , 10th , 19th and 28th , by natural addition produce for the Single number the "one" or symbol of the Sun, the First Cause or Creative Force, if you were born on any of these dates you come under a very powerful combination which, if understood and used, should bring you a considerable measure of success.
  The 28th of May, being the commencement of the incoming Sign of Gemini, ruled by Mercury (Positive), will make your mentality even keener than if born on the other dates in May.
  The basic foundation for your character and disposition is that described in the preceding pages for persons born in May.
  In Your special case the stronger qualities will more dominate your life and career.
  You will have a considerable amount of self-reliance and be creative and original in all your plans.
  You will be very patient and gentle, unless prodded to anger by jealousy or underhanded work, but you will be, at times, liable to sudden outbursts of temper and passion if opposed in your plans and ambitions.
  You will have large vision about whatever work you may be engaged in, but it will not be an easy matter for you to stand interference of any kind, petty annoyances or criticism.
  You would meet with success in any career that would bring you before the public, also in offices or in executive work in any kind such as the head of hospitals, institutions and large enterprises.
  If born on May 28th , the nervous system will be inclined to be over-strung and too active.`,
       finance: `Finance: You will be lucky in money matters, but inclined to indulge in luxury and an extravagant style of living.
  You will be prone to take great risks in speculation or in attempting to do business on too large a scale, but speaking generally, you may expect to be successful.`,
       health: `Health: As regards health, you will possess a good constitution, backed up by great vitality, which you will at times undermine by expending too much energy in carrying out your plans and not taking enough systematic rest and sleep.
  The chief delicacy you may have at periods to contend against will be neglected colds settling on the lungs and chest, but fresh air and sun baths would keep you protected against such ailments.`,
       importantNumbers: `Your most important numbers and dates for carrying out your ambition are the 1st , 2nd , 6th , 10th , 11th , 15th , 19th , 20th , 24th , 28th and 29th .`,
      colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear the colours relating to your planets as much as possible, such as the Sun: All shades of gold, orange or bronze to golden brown.
  Moon: All shades of green, white and cream.
  Venus: All shades of blue, from the lightest to the darkest.
  If born on May 28th you can employ the colours of Mercury, all light shimmering materials.`,
       jewels: `Your "lucky" jewels are diamonds, topaz, amber, moonstones, jade and turquoise, and for May 28th all bright glistening stones.`,
      climactericYears: `The most important or climacteric years in your life are the 1st , 2nd , 6th , 10th , 11th , 15th , 19th , 21st , 24th , 28th , 29th , 33rd , 37th .
  38th , 42nd , 46th , 47th , 51st , 55th , 56th , 60th , 64th , 65th and 69th .`,
      magneticAttraction: `You will find yourself attracted to persons born on any of the series of the "one", "two", or "six" in any month, and if born on May 28th , also to persons born under the number five series, such as the 5th , 14th or 23rd .`
     },
  
  
     2: {
     character: `Persons Born on May 2nd , 11th , 20th , 29th Number 2 People in This Month If you were borne on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon, Neptune and Venus (Positive), in the Zodiacal Sign of Taurus, the Bull, First House of the Triplicity of Earth; but if borne on May 29th you come under the Sign of Gemini, First House of the Triplicity of Air, whose ruler is the planet Mercury (Positive).
  The basic foundation of your character and disposition is described in the preceding pages for persons born in May.
  In your case the gentler qualities will make themselves more manifest.
  The Moon will have a special influence on you, as in this period of the year it is in "the House of its Exaltation".
  You will be imaginative, romantic, artistic, with a decided leaning towards idealism, mystical studies, occultism and spiritualism; such things will attract you and are likely to influence your life considerably.
  Your talents will incline to express themselves in literature, art, music and the theatre.
  You will endeavour to fill you home with beautiful things, in harmonious surroundings ill grate on your sensitive nature.
  You will have many change; in places of residence, be rather restless and with a great desire for travel, but as you are born in a Zodiacal Fixed Sign, and it being the First House of the Triplicity of Earth, you may find considerable difficulty in gratifying our love of travel and change, but not so much as if born on may 20th and 29th .
  Your sympathies will be easily aroused for the sufferings of others, and many demands are likely to be made on your time which will detract from your power of application.
  You will have a naturally affable disposition, very attractive to strangers and very adaptable to new surroundings.
  You will make numerous friends, almost too many for your own good, but as a general rule you will be lucky, especially in your relations with your opposite sex.
  You will have remarkable intuitions and possible very accurate dreams.
  All things relating to the earth and its product will be favourable to you.
  but you will have to guard against a desire for too much pleasure, entertaining and love of the good things of life.`,
      finance: `Finance: Financial conditions will be very contradictory to one born in this part of the Zodiac.
  You will have "runs of luck" to be followed by equal periods of reverses when nothing will appear to go right.
  You should avoid speculation and gambles of all kinds and hold your inclination for extravagance well in check.
  You would make money in any career that would bring you before the public.`,
       health: `Health: In health you will have to be particularly careful of chills internally, influenza and colds lying too long on the bronchial tubes, lungs and throat.
  The nasal passages are likely from middle life to become affected, and unless care is taken, you will at times suffer from growths in the nose, also with sinus trouble, mastoids and some defect in the hearing.`,
      importantNumbers: `Your most important numbers are "twos", "seven" and "sixes", and all their series, and you should endeavour to carry out your plans on dates making these numbers, such as the 2nd , 6th , 7th , 11th , 15th , 16th , 20th , 24th , 25th and 29th .
  If born on May 29th , the series of the "number five" will be equally important, such as the 5th , 14th and 23rd .`,
       colors: `To increase your magnetic vibrations you should wear in your clothing, at least some part of it, the colours belonging to your principal planets, which are: The Moon: All shades of greens, whites and creams.
  Venus: All shades of blues.
  Neptune: All shades of dove-greys, and electric shades.
  If born on May 29th you can add to these the Mercury colours-all glistening shimmering materials.`,
      jewels: `Your "lucky" jewels are green jade, emeralds, moonstones, cat's-eyes, pearls, turquoise, all blue stones, and if born on May 29th , all glistening stones.`,
       climactericYears: `Your most important or climacteric years are the 2nd , 6th , 7th , 11th , 15th , 16th , 20th , 24th , 25th , 29th , 33rd , 38th , 42nd , 51st , 52nd , 56th , 60th , 61st , 65th , 69th .`,
        magneticAttraction: `You will be much attracted to persons born in the series of "ones" "twos," "sixes" and "seven", such as the 1st , 2nd , 6th , 7th , 10th , 11th , 15th , 16th , 19th , 20th , 24th , 25th 28th and 29th in any month of the year, and if borne on May 29th also the 5th , 14th and 23rd .`
     },
  
  
     3: {
     character: `Persons Born on May 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates, following the rules of Zodical Astrology and my system based on Chaldean Numerology, you come under the Vibrations of Jupiter with Venus (Positive), in the Zodiacal Sign of Taurus the Bull, First House of the Triplicity of Earth.
  If born on May 30th you come under the influence of Gemini ruled by Mercury (Positive), First House, of the Triplicity of Air.
  This is a very good combination and should make you very successful in life provided you do not allow the Venus or love side of your nature to become too strong.
  The basic foundation of your character and disposition is described in preceding pages for persons born in May.
  In your special case you should give full scope to the ambitious side of your nature and always endeavour to associate with persons above you in social or business life.
  You will rebel against injustice in any form and will find yourself inclined to take the part of the "under dog" in any fight or cause to which your sympathies may attract you.
  You will have very strong independent views about religion will and inclined to make a philosophy of your own.
  You will be positive and determined in all your ideas and rather obstinate in the carrying out of your plans.
  You will be inclined to marry early, but from the combinations of planets under which you were born, the chances are that you will marry three times, the third being the best.
  Some of the love affairs in your life are likely to be quite out of the ordinary.
  Your nature will be intensely artistic in every sense of the word.
  You could excel in painting, music, literature and many forms of public life, but you will be so versatile that you will find it difficult to make up your mind on the form of work you should select.
  You will have a very intense sense of justice and will often find yourself in opposition to others on this question.
  You will have a deep love of home and your native land, and will always endeavour to foster national projects of benefit to your country.
  You will aid philanthropic and charitable organizations, and will give your time freely in working for their interests.
  You will receive honours from societies in connection with your work, and become a highly respected member in whatever community you may belong.`,
       finance: `Finance: In Matters of finance you need have nothing to fear, Great opportunities will come across your path.
  Out of nothing you could create much, you only danger being that of undermining your resources by gong in for large schemes of a speculative nature.`,
       health: `Health: Once past the earlier years, this period of the Zodiac in which you were born will endow you will good health and vitality.
  Overwork and constant demands for your services will be the only enemy you need fear as far as health is concerned.
  Your motto will "wear out but not rust out".
  On account of this you will not be likely to reach any great age.
  You will have a tendency to some delicacy of the lungs and throat, but this you may grow out of if you pass through middle life.`,
       importantNumbers: `Your most important numbers and dates are the "three" and "sixes", such as the 3rd , 6th , 12th , 15th , 21st , 24th , and 30th .
  If born on May 30th , the series of the "fives" will be also important, such as the 5th , 14th and 23rd .
  You should endeavour to carry out your plans on dates making these numbers.`,
       colors: `To increase your magnetic vibrations you should wear the colours, (at least in some part of your clothing), of: Jupiter: All shades of violet, mauve or violet-purple.
  Venus: All shades of blue.
  If born on May 30th , you can add the colours of Mercury, which are white, creams and all light shades.`,
      jewels: `Your "lucky" jewels are the amethyst and all violet or purple stones and the turquoise.
  If born on May 30th , diamonds and all glistening stones.`,
       climactericYears: `The most important or climacteric years in your life are the 3rd , 6th , 12th , 15th , 21st , 24th , 30th , 33rd , 39th , 42nd , 48th , 51st , 57th , 60th , 66th and 69th .`,
       magneticAttraction: `You will find yourself attracted to persons born on the 3rd , 6th , 12th , 15th , 21st , 24th and 30th in any month of the year.
  If born on May 30th you can add to these, the series of the "number five", such as the 5th , 14th and 23rd .`
     },
  
  
     4: {
     character: `Persons Born on May 4th , 13th , 22nd , 31st Number 4 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus, the Sun and Venus, in the Zodiacal Sign of Taurus, First House of the Triplicity of Earth; but if born on May 31st you come under the Sign of Gemini ruled by Mercury (Positive).
  This is a peculiar combination which promises a life a very distinctive and unusual.
  This basic foundation of your character and disposition is described in the preceding pages for persons born in May.
  In your special case it is the unusual and unexpected that is inclined to happen and you are likely to take up some path in life out of the ordinary.
  These combinations are extremely favourable for philosophers, writers, composers, etc.
  From a purely worldly standpoint you may not be what is called lucky, and in financial affairs you will be likely to have many changes, but always of a sudden or unexpected kind.
  You will not easily fit in with other people's views and in a general way you will arouse opposition in your work and ideas.
  You will, however, be best in surmounting obstacles and rising to the call of emergencies.
  Being of an original turn of mind, new ideas and methods will appeal to you, also inventions or novel out-of-the-way things.
  Marriage will be equally out of the ordinary, more on the lines of an experiment or for some underlying purpose.
  You will be strong-willed in your views and opinions, inclined to analyze and be critical in your conclusions.
  You will not be very adaptable to people or conditions.
  You will keep much to yourself and care for very few companions, but for those you do like you will care very deeply.
  You will have the ability to make a very unusual artist, writer or inventor, but anything you do will be more or less coloured by your own pronounced individuality.`,
        finance: `Finance: In Money matters you will come under peculiar conditions.
  Again, the unexpected more than the expected is likely to happen.
  Original ideas and plans will be born in your mind not inclined to fit in with other people's views.
  You will make money by unusual methods, you could become an inventor or an unconventional writer, painter or musician.
  Ordinary business routine will not attract you and you are likely to find it extremely difficult to work with others.`,
       health: `Health: Health for you will be under strange conditions; illnesses will be sudden and unexpected.
  You will suffer at times from ailments difficult to diagnose, such as sudden pains and cramps in the stomach and lesions in the internal organs.
  You will be subject to chills and colds without warning, influenza and inflammation of the lungs.
  You should eat lightly but often, and study food that seem to suit you personally, and not follow conventional diets.`,
       importantNumbers: `You will find the numbers of "four", "sixes" and "eight" drawn toward you and playing an important role in all your affairs.
  These series are 4, 6, 8, 13, 15, 17, 22, 24, 26 and 31, or any numbers that total up to the root of the 4, 6 and 8.`,
       colors: `To increase your magnetic vibrations you should wear the colours of the Sun, Uranus and Venus or use them in some part of your clothing.
  If born on May 31st , you can add to these the colours of Mercury, which are white, cream and all light glistening materials.
  Sun: All shades of gold, yellow, orange, bronze to golden brown.
  Uranus: All shades of grey and electric shades, also sapphire blues.
  Venus: All shades of blue.`,
      jewels: `Your "lucky" jewels are topaz, amber, diamonds, sapphire and lapis lazuli.`,
      climactericYears: `The most important or climacteric years in your life are the 4th , 6th , 13th , 15th , 22nd , 24th , and 31st , 40th , 42nd , 49th , 51st , 58th , 60th , 67th and 69th .`,
       magneticAttraction: `You will find yourself much attracted to persons born or the 4th , 6th , 13th , 15th , 22nd , 24th , 31st , of any month; those representing the "eight" series, if born on May 31st , also those born in the series of the "number five", such as the 5th , 14th and 23rd .`
     },
  
  
     5: {
      character: `Persons Born on May 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates, by the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of mercury with Venus (Positive), in the Zodiacal Sign of Taurus, First House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in the preceding pages for persons born in May.
  In Your special case this is a good combination as far as mentality is concerned.
  It gives an unusual keenness, originality and alertness of mind.
  You will possess good reasoning powers, but critical, analytical and observant.
  You will be very independent in spirit, but extremely adaptable to persons and conditions, without allowing them to influence you in any way.
  You will have great versatility in work and could succeed in almost any line, provided you were sufficiently interested to make the effort.
  You will not easily be ties down to any one thing or to any one person, and in consequence may have expect to have many changes in your life and career.
  You will be much influenced by your opposite sex and yet strangely independent of them.
  You will have many love affairs, but will be rather changeable in your affections.
  You will be likely to marry early, but any marriage in your early life will not be disposed to last for very long, and would be likely to cause you disappointment and interference with your career.
  Exceptionally fine brain power is the keynote of persons born under this combination.`,
       finance: `Finance: In questions of finance you will be a puzzle to your friends as well as to yourself.
  You will employ money you make in odd and unusual ways.
  As a general rule you will be lucky in making money and in the accumulation of possessions, especially in connection with land, houses or speculations, if you make up your mind to go in for such things.
  You will be likely to gain prominence and position in the world by following a career out of the ordinary.`,
       health: `Health: In health you will be inclined to suffer from nervous ailments.
  You are also likely to have many experiences of the surgeon's knife.
  The head and face will be able to meet with injury, also the teeth, jaws and bones of the skull.
  The sex organs will be delicate and have a tendency to suffer from inflammation and chills.
  The above remarks regarding health will not apply so much to persons born on May 23rd as they do to those born on May 5th and 14th .`,
       importantNumbers: `Your most important numbers and dates will be "five" and "sixes" and all their series, such as the 5th , 6th , 14th , 15th , 23rd and 24th .`,
       colors: `To increase your magnetism, you should wear, at least in some part of your clothing, the colours of Mercury, Venus and the Moon, which are: Mercury: All shades of light colours, and glistening materials.
  Venus: All shades of blue from the lightest to the darkest.
  Moon: All shades of green, creams and whites.`,
     jewels: `Your: "lucky" jewels are the diamond, turquoise, emeralds, green jade and all glistening bright stones.`,
      climactericYears: `The most important or climacteric years in your life are more especially the 5th , 6th , 14th , 15th , 23rd , 24th , 32nd , 33rd , 41st , 42nd , 50th , 51st , 59th , 60th , 68th , 77th .`,
       magneticAttraction: `You will be much attracted to persons born on the 5th , 6th , 14th , 15th , 23rd and 24th of any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on May 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates in May, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and the Moon in the Zodiacal Sign of Taurus, House of Venus (Positive), First House of the Triplicity of Earth.
  The basic foundation of your disposition and character is described in preceding pages for persons born in May.
  In your special case everything that concerns the love side of your nature, or the love of humanity itself will be the most important.
  For this side of your nature you will do any kind of work make any sacrifice or bend your back to any hardship.
  You will have intense feelings and emotions, a devotional nature, swayed by enthusiasm for whatever your purpose may be, whether it lead you through war or revolution, or in the quieter paths of work as a preacher, artist, writer or simply doing your duty to those you love.
  Without this undercurrent of fanatical enthusiasm, life for you would be something not worth having.
  Possessing the characteristics of Taurus the Bull in whose Sign you were born, and under Venus its Ruler, Your birth number a six in this month contains all the qualities of strength and weakness in the most decided way possible to imagine.
  You have here what is called a "double Venus" but with the opposition of Mars in its mental aspect from the other side of the Zodiac, October 21st to November 20th .
  You can either love or hate with the greatest intensity.
  You could be an angel or a devil in your emotions.
  The danger in your affections, if you do not keep your nature well under control, is that of jealousy.
  The danger in your intensity of purpose is also lack of control.
  If you thought that for the good of humanity at large your purpose in life called for revolution, you would stick at nothing to accomplish what you considered was your duty.
  There are many examples in history of this, in such cases as Robespierre and Marat during the French Revolution, both "number six" men in this period of the year who waded through even the blood of their friends to accomplish their purpose.
  On the opposite side, there is the noble example of Florence Nightingale who endured every hardship to help the sick and wounded soldiers in war.
  Keeping well in hand the fire of emotion and enthusiasm burning in your heart, you should devote yourself to some high ideal, leaving behind you "footprints on the sands of time".
  From the better side of your disposition you will be a deep lover of nature in all her forms.
  You will worship beautiful scenery, gardens, flowers and be most artistic in your home.
  Music and all forms of art will appeal to you and you should have considerable talent in such directions.
  You will love to give enjoyment and pleasure to your friends and will be particularly successful in social life, in organizing fetes, entertainments and amusements of all kinds.
  You will be devoted to children and if your marriage does not give them, you will be likely to adopt them.
  You will have many idealistic companionships with members of your opposite sex, but more from the standpoint of affection and good comradeship than from passion.
  You will keep your youth and remain remarkably young looking all your life.`,
       finance: `Finance: As a rule, you will be more lucky in money matters than otherwise, having much given to you and meeting great opportunities.
  If you had to go into business you would make a success of enterprises connected with the luxurious side of life more than any other, such things as the decorations of homes, millinery, dresses and flower shops, or the catering of food, restaurants or hotels.
  Another side of your nature will incline.
  You very much towards some artistic profession, such as music, painting, writing, the theatre or the concert or lecture platforms.
  You would do well in all such lines of work.`,
       health: `Health: You will start life with an excellent constitution, but owing to a tendency to luxury and good living, you will be inclined to "dig your own grave with your teeth".
  You will have a slender symmetrical from in your early years which you are likely to ruin as you advance in life by over- indulgence in sweet stuffs and the good things of the table.
  You will be liable to fatty degeneration of the heart and a dropsical condition in your later years, but such things are in your own power to control or not, as you will.
  There may also be some tendency for delicacy relating to the lungs, bronchial tubes and throat.`,
      importantNumbers: `Your most important dates are the "twos", "threes" and "sixes" and all their series, such as the 2nd , 3rd , 6th , 11th , 15th , 20th , 21st , 24th , 29th , and 30th .
  The reason that I give the numbers of the 2, 11, 20 and 29 is that the Moon is in its "Exaltation" in the month of May.
  The series of nine is not so favourable as it generally acts in opposition if it comes from other peoples' lives.`,
       colors: `To increase your magnetic vibrations you should wear the colours that the above numbers and planets represent.
  Moon: All shades of green, white and cream.
  Venus: All shades of blue.
  Jupiter: All shades of mauve, violet and violet-purple.`,
      jewels: `Your "lucky" jewels are moonstones, cat's eyes, jade, opals, emeralds, all green stones, also the amethyst.`,
      climactericYears: `The most important or climacteric years in your life are the 2nd , 6th , 15th , 20th , 24th , 29th , 33rd , 38th , 42nd , 51st , 56th , 60th , 65th , 69th and 78th .`,
      magneticAttraction: `You will be much attracted to persons born on dates making a "two" "three" or "six" or their series, in any month of the year.`
     },
  
  
     7: {
      character: `Persons Born on May 7th , 16th , 25rd Number 5 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon and Venus, in the Zodiacal Sign of Taurus, First House of the Triplicity of Earth.
  If born on May 25th , you will be in the "cusp" of Gemini, First House of the Triplicity of Air, whose Ruler is Mercury, (Positive).
  The basic foundation of your character and disposition is described in preceding pages for persons born in May.
  In your special case it is the gentler or more visionary side of the character that will come out the most, unless you were born on the 25th when the stronger mental characteristics will be more apparent.
  This combination of planets will incline you towards the love of odd and curious things, a deep regard for mysticism, occultism, and everything appertaining to such subjects.
  With a little encouragement you could easily develop yourself along such lines.
  You are likely at times to have remarkable presentiments and dreams and unusual experience in coming in contact with strangers, together with prevision of future events in regard to humanity as a whole.
  You will have a bent towards inventions of an unusual order, and may do extremely well in new ideas, also in such things as wireless, television, and radio work.
  You will not feel at home in matters tending towards monotony of any kind, but you can have every reason to expect success in unusual lines of work or in some career connected with humanitarian development for public welfare.
  If you have money at your disposal you will be desirous of using it in aid of clinics, hospitals or institutions for the benefit of others.
  You will be likely to take ; an interest in secret societies or political organisations dealing with large masses of people.
  You will have a gift of expression in writing and eloquence that will give you position and weight among wide circles.
  You will not care much for the ordinary pleasures of life and may be considered odd or eccentric in your manner of living.
  You will be naturally kind hearted and generous but have your own views as to what you should do with your money.
  You will find considerable difficulty in suiting yourself to married life and if possible to avoid doing so, you should not many in your early year.
  You will be endowed with unusual brain power and could be successful as a writer, poet, painter, musician or inventor.`,
      finance: `Finance: If you were born on May 7th , 16th or 25th , you will labour against many disadvantage during your early years.
  In spite pf this you may expect to gain a considerable amount of financial success, also position and prominence due to your own superior mentality, not dependent on what is called luck or chance.`,
       health: `Health: As a rule you may not feel very strong or robust, and you may tire easily in any continuous effort.
  You are also liable to have a functional weakness of the intestinal tract and should be most careful in all questions of diet.
  You will not be likely to have as much physical stamina as you have nerve force, perseverance and endurance.
  You will be subject at times to periods of mental depression and should avoid drugs and stimulants of all kinds in your desire to escape from your gloomy moods.`,
       importantNumbers: `Your most important numbers and dates will be "sevens", "twos" and "sixes" and all their series, such as the 2nd , 6th , 7th , 11th , 15th , 16th , 20th , 24th , 25th and 29 th .
  You should endeavour to make your appointments or carry out your plans on these dates.`,
      colors: `In order to increase your magnetism, you should wear or employ in some part of your apparel the colours of your important planets, which are: Neptune: All shades of dove-greys and electric colours.
  Moon: All shades of greens, creams and white.
  Venus: All shades of blue, from the lightest to the darkest.`,
      jewels: `Your "lucky" jewels are principally emeralds, pearls and moonstones, also the turquoise.`,
        climactericYears: `Your most important or climacteric years of life are the 2nd , 6th , 7th , 11th , 15th , 16th , 20th , 24th , 25th , 29th , 34th , 38th , 42nd , 43rd , 47th , 51st , 56th , 61st , 70th .`,
       magneticAttraction: `You will find yourself much attracted to persons born on the 2nd , 11th , 20th , 28th , 7th , 16th and 25th in any month of the year, also those born under the series of "one" and "four" such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st .`
     },
  
  
     8: {
      character: `Persons Born on May 8th , 17th , 26th Number 8 People in This Month If you were born on any one of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Saturn, the Moon and Venus, in the Zodiacal Sign of Taurus, First House of the Triplicity of Earth.
  If born on May 26th you will be in the "cusp" of Gemini.
  First House of the Triplicity of Air, whose ruler is Mercury, (Positive) The basic foundation of your character and disposition is described in Preceding pages for persons born in May.
  In your special case you may expect a very unusual life and career, either one fortunate and powerful, or extremely the reverse.
  You will find yourself what is called a "Child of Fate", in which circumstances surroundings and conditions will play the most important part.
  You will crave for love and affection from others and yet feel very isolated in life.
  You will not be demonstrative in your emotions and will find great difficulty in expressing your feelings.
  You will sacrifice yourself greatly for others, especially your own relations or those bound to your by ties of affection, yet you will feel "lonely hearted" and be inclined to feel you have not had the return for what you have done.
  You are likely to have much sorrow and loss caused by relatives, and in all matters of love or affection you are likely to pass through many severe trials.
  You will find much restriction and difficulties preventing you from carrying out your own individual ambitions.
  You may rise to hold very high positions but they will nearly always carry with them some heavy cross or responsibility for you to bear.
  You will be of a deep thoughtful nature, extremely reserved and cautious in all affairs concerned your own individual career.
  If born on May 26th , the "cusp" of the incoming Sign of Gemini ruled by Mercury (Positive) you will more adaptable to both persons and circumstances than if born under the other number "eights."`,
      finance: `Finance: You will gain through strict economy, carefulness and prudent investments in things of a solid nature, but not from "get-rich-quick" methods, or gambles of any kind.
  You would have great ability in the opening up and development of land, also mining and house properties.`,
      health: `Health: In matters of Health you will have a solid, study constitution, but one more or less of the phlegmatic order, with some tendency for tumours, internal lesions, appendicitis, stoppages and trouble in the lower intestinal tract.
  You will be liable to serve attacks of rheumatism and should endeavour to live in a high dry climate as much as possible.`,
      importantNumbers: `You will find the number of "fours" and "eights" inclined to be drawn into your life in many extraordinary ways, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .`,
       colors: `To increase your magnetic vibrations, I would advise you to use the colours of: Sun: All shades of gold, yellow, orange, golden-brown.
  Moon: All shades of green, creams and white.
  Venus: All shades of blue, especially sapphire blues.`,
      jewels: `For "lucky" jewels you should wear black diamonds, topaz, amber, green, jade, pearls sapphires and turquoise.`,
       climactericYears: `The most important or climacteric years of your life are the 4th , 8th , 13th , 17th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 62nd , 67th , 71st and 80th .`,
       magneticAttraction: `You will find yourself greatly attracted to persons born on the 4th , 8th , 13th , 22nd and 26th any month of the year.`
     },
  
  
     9: {
      character: `Persons Born on May 9th , 18th , 27th Number 9 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars, Venus and the Moon in the Zodiacal Sign of Taurus, first House of the Triplicity of Earth; but if born of May 27th you come under the Sign of Gemini, First House of the Triplicity of Air, whose Ruler is Mercury, (Positive).
  This exceptionally strong combination will make you have a very eventful life, but one largely based on adventure, danger, love and romance.
  At the back of these qualities you will have courage, headstrong will-power and determination of purpose, whether it be for good or evil, as your mentality may decide.
  You will have considerable talent for organization, the desire for large ambitious schemes, the ability to amass wealth and power, but with it all you will be inclined to be weighed down by heavy expenditure in all your undertakings.
  You will excite powerful enemies and great opposition.
  Your life will at times be threatened by danger and violence.
  You will be forced into legal contests, both long and expensive, and often be faced with heavy financial losses.
  If you practise control over yourself, you may be able to make much out of your great qualities, but there will always be a danger of your letting your Mars nature and hasty temper get the better of your judgment and provoke opposition.
  You will have great attraction for your opposite sex, experience danger caused by jealousy and you will hardly get through the full span of your life without running the risk of wounds, injuries and possibly a violent death.
  Both the men and women born under this combination will have at times a tendency towards intemperance, but more when unsuccessful than during the period of success.
  You will have very practical qualities, with great ability as a manager, supervisor or in some executive position of responsibility.
  You would also rise rapidly in the Army, Navy or in connection with government work.
  You will succeed in whatever your ambition may be by sheer force of willpower and self-confidence.
  The above remarks will not apply as strongly to persons born on May 27th as they do to those born on May 9th and 18th , for the reason that on May 27th the Sun has already entered the Sign of Gemini which is on a more mental plane than are the characteristics given to May 9th and May 18th .`,
     finance: `Finance: You will be under good conditions for making money in business, industry or enterprise, and you will have many opportunities of amassing wealth if you keep control over your strong-willed disposition, which at times will be inclined to wreck your good fortune by causing expensive litigation and powerful enemies to rise in your path.
  You will make money by your gift for organization and ability to manage others in masses, but you should try to develop tact in the handling of individuals and avoiding disputes.
  You will be quick-witted and have remarkable foresight in your plans, you will be inclined to lack patience in meeting with delays or opposition from others, but taking things all round, born in this period of the Zodiac, you should have every reason to expect considerable success in all you undertake.`,
       health: `Health: In health your constitution will be robust and charged with vitality.
  You will, however, have many experience of the surgeon's knife.
  The head and face will be the principal pails of the body to meet with injury, also the teeth, jaws and bones of the skull.
  The sex organs will be liable to suffer injury and the appendix, it is probable at some period of your life will have to be removed.
  You will run much danger from accidents, also from firearms, fires, explosions and such like.
  You will be found of animals, outdoor life and exploration, but will have considerable danger from such things.`,
       importantNumbers: `Your most important number and dates will be "nines" and "sixes" and all their series, such as the 6th , 9th , 15th , 18th , 24th and 27th .`,
       colors: `To increase your magnetism you should wear, at least in some part of your clothing the colours of Mars, Venus and the Moon, which are: Mars: All shades of red, crimson and rose.
  Venus: All shades of blue.
  Moon: All shades of green, cream and white.
  If born on May 27th , you can add to these colours those of Mercury, all light shades and glistening, shimmering materials.`,
       jewels: `Your "lucky" jewels are the ruby, garnet, red stones, turquoise, emeralds, green jade, moonstones, and diamonds and all glistening stones if born on May 27 th .`,
      climactericYears: `The most important or climacteric years of your life are more especially the 6th , 9th , 15th , 18th , 24th , 27th , 33rd , 36th , 42nd , 45th , 51st , 54th , 60th , 63rd , 69th and 72 nd .`,
       magneticAttraction: `You will be much attracted to persons born on the 6th , 9th , 15th , 18th , 24th and 27th in any month of the year.
  If born on May 27th also the series of the "five", such as the 5th , 14th , and 23rd .`
           }
       }
   },
    june: {
    generalInfluence: `The zodiacal influence for the month of June in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Gemini—the Twins-commences on May 21st , but for seven days being overlapped by the "cusp" of the previous Sign, it does not come into full power until on or about May 28th .
  From this date onwards it is full force until June 20th , it is then for seven days gradually losing its strength, on account of becoming overlapped by the "cusp" of the incoming Sign of Cancer.`,
  
  
    generalCharacter: `People born in this part of the Year, namely from May 21st to June 20th and in the "cusp" to June 27th , have the characteristics of Gemini—the Twins and may be considered more or less dual in character and in their mentality.
  Their brains are subtle, versatile and brilliant.
  Of all the Signs of the Zodiac, they are the most difficult to understand.
  They are mentally quick and rapid in thought and in matters where a subtle mentality is required they can out-distance all rivals.
  They are charming in society and if taken in their mood of the movement, they are the most delightful people possible to meet, but one must not expect to have any deep hold over them or expect them to keep to their promises or plans, unless it suits their purpose to do so.
  In their heart they believe they are constant and faithful, and so they may be at the moment, but each moment to them has a separate existence.
  They quickly grasp any project presented, and can pick things to pieces, reduce all to nothing by their wit, sarcasm or criticism.
  If they exercise their will-power to stick to one thing, they make most brilliant successes of whatever they undertake.
  One class under this combination in June succeed best as far as making money is concerned, in speculative matters, on the Stock Exchange, as company promoters, or exploiting inventions or new ideas in business.
  They also do well in diplomatic negotiations, interviewing people, travelling through countries and making themselves charming to strangers.
  Their personality is so fascinating that people leave their presence thinking what a delightful interview they have had, and they generally become idolized by those under them.
  In matters of affection they are the greatest puzzle of all.
  They can love passionately and yet be unfaithful at the same time.
  They often keep two homes, and usually by their wonderful tact escape being found out.
  They make hosts of friends and are kind-hearted and generous to the person who fills their thoughts at the movement, but "out of Sight, out of mind", explains their fits of "forgetfulness" as nothing else can.
  They are highly strung and restless.
  If they are rich and can travel, they are always on the move.
  They love speed and rapid movement.
  They are good patrons of express trains, fast motor cars, airplanes and any invention that can eliminate distance and time.
  They often have great "ups and downs" but nothing makes much impression on them.
  If they are depressed one moment, they may be equally gay the next.
  They change their outlook on life many times during their career, but if they once change in their feelings or affections for a person, it is as if that person for them had ceased to exist.
  They often abandon their ambition at the very moment of success, and they equally easily give up some position of responsibility just because it fails to hold their interest.
  The combined planetary influence and the position of the Sun in the intellectual and dualistic Sign of Gemini, also called the House of Mercury (positive), exerts a strong Mercurial influence upon the whole nature, giving them much intellectual mental powers, but at the same time a disposition which is involved, enigmatical and very difficult to understand.
  Such persons are largely governed by an insatiable craving for variety, and go to any length to break through a spell of monotony and routine.
  The intellect usually is brilliant and shows good reasoning ability, but the mental activity is so intense that, as a rule, it must seek expression in several directions at the same time.
  Persons born in this part of the year seldom, however, derive much satisfaction from work accomplished, for their nature has always the tendency to subject it to severe criticism afterwards.
  Such persons often attain a prominent position in the center of some progressive movement, but they generally follow two professions, one to suit the public and the other to suit themselves.
  They are ingenious, inventive and energetic, but they should cultivate persistency and tenacity of purpose.
  If such persons cultivate concentration of their mental powers, they can always achieve success.`,
  
  
     generalFinance: `Finance: June is difficult month to describe the financial condition of persons born in this part of the year.
  It being the House of Mercury, (Positive), whose "cusp" runs from May 21st to May 28th , the qualities of the planet Mercury being to overlap those of Venus of the preceding Sign.
  The intellect appears to become sharper, keener and more ambitious as birth dates approach May 28th , and from that out become more and more active under the Mercurial influence.
  As Mercury is essentially "a planet of the mind", it all depends on what direction the mentality is stimulated.
  It may be that the desire will develop for purely intellectual things, such as for science, art, literature, music and such like studies.
  If such is the case, one may be sure the ambitions will be strong and will compel the man or woman to excel in any of these lines of work.
  If, however; the mind runs in the direction of the accumulation of material matters, such as finance, the tendency will to get into lines of work where money can be made quickly and in consequence business, and particularly speculation, will attract the individual.
  The danger of being born under the influence of Mercury in this part of the year, is, that the man or women will never be satisfied with whatever their success may be, and in the pursuit of especially money, they will be inclined to risk too much as speculators and so over-reach themselves in their efforts.
  In the same way, if the mind runs on the more intellectual side of life, the individual will be inclined to exhaust their energies and so bring on some form of nervous breakdown that may impair the continuation of their efforts.
  In both cases, the result in the end would amount to the same thing-namely, periods of cessation of effort and in consequence uncertainty of finance.
  If the nature is kept well under control, such periods need not happen, but the danger will be there just the same.`,
  
  
    generalHealth: `Health: The question of health is governed by similar conditions for persons born in June.
  It is purely a question of the effect of "mind over matter".
  If individuals born in this period of the year are successful and happy, they will baffle or prevent the attacks of disease.
  If not, they are liable to become the victims of all forms of illness that can be laid down to defects of the nervous system.
  In health, persons born in this part of the year are seldom physically very strong.
  They live on their nerves and deplete their nervous system.
  They are like electric batteries that must be re- charged from time to time.
  If they can do this by sleep they may then escape the breakdown that such persons are so often threatened with.
  They have a tendency to suffer from nervous illnesses, such as stammering of speech, affection of the tongue and in some cases, catalepsy.
  The lungs are inclined to be delicate and pleurisy and pneumonia develop with them easily.
  They are prone to eczema, scurvy and diseases of the blood.`,
    generalMarriage: `Marriages, unions, partnerships, etc.: Marriage, unions or partnerships are seldom a success with those born under the influence of the Zodiacal Sign of Gemini governing the month of June.
  There are exceptions to this, of course, as there are to all rules.
  June being the "First House of the Air Triplicity", those born in this period will find their most likely chances of success in unions, marriage or partnerships with those born in their own Sign, May 21st to June 20th , First House of the Triplicity of Air.
  In the second House of the Air Triplicity-September 21st to October 20th ; or in the Third House of the Air Triplicity-January 21st to February 19th and in the seven days of the "cusp" at the beginning or ending of each of these periods.
  They are also attracted to persons born in the month of the year the exact opposite to their own, in this case to those born from November 21st to December 28th .`,
  
  
    numbers: {
     1: {
     character: `Persons Born on June 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Mercury (Positive), in the House of Gemini, First House of the Triplicity of Air.
  If born on June 28th , you come under the influence of Cancer, First House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June.
  In your special case the stronger qualities described will be more dominant in your life and career.
  You will be exceptionally kind-hearted and sympathetic, easily influenced by sympathy and praise, often to your detriment; very sensitive idealistic with pronounced imaginative ability.
  You will have a very active mind, always ready for any emergency.
  You will be aspiring and ambitious, and will go through great difficulties to realize your ambitions.
  You are likely to be occupied in two occupations at the same time, but must work in your own way, as you cannot tolerate any interference.
  You will be dual in nature and difficult for other persons to understand.
  You will be restless, forever on the move and with a great desire for travel and change.
  In spite of this you will take a serious interest in all new problems of science.
  You will be a good reasoner and investigator.
  At times you will be a great reader and will be likely to express yourself as a writer.
  You will desire to have a happy home life and make every effort to do so, but in this you are likely to have serious difficulties.
  You will be actively engaged at something all the time and mentally very versatile.
  If born on June 28th you will have a strong magnetic personality and be exceptionally independent in your views and ideas.`,
      finance: `Finance: Yours is a very favourable period of the Zodiac for success in finance, but brought about by your own mental activity.
  You will have remarkable prevision as to the course stocks and shares and industry in general are likely to take.
  You will be strongly inclined to speculation and any form of taking chances.
  You are likely to be successful in such things if you can follow your own ideas and intuition.`,
       health: `Health: In health you will be more wiry than strong- inclined to be underweight rather than to put on flesh.
  You will live on your fund of nervous energy, but will at times "run down" like an electric battery that has been over-worked; to recoup, you will need rest-spells and plenty of sleep.
  There is no disease you will be liable to, except acute attacks of indigestion, principally brought on by over mental effort, and living on your nerves, together with some tendency for lung trouble especially in your early years.`,
       importantNumbers: `Your most important numbers and dates are those whose root numbers are the "one", "fours" and "fives" and all their series, such as the 1st , 4th , 5th , 10th , 13th , 14th , 19th , 22nd , 23rd , 28th and 31st .
  You should use these dates in endeavouring to carry out your most important plans or engagements.`,
      colors: `To increase your magnetic vibrations you should wear, in some part of your clothing, the colours belonging to your planets, such as the Sun: All shades of gold, yellow, orange to golden brown.
  Uranus: All shades of grey.
  Mercury: All light colours and glistening materials.
  And if born on June 28th you can use all shades of green, especially the pale greens.`,
      jewels: `Your "lucky" jewels are diamonds, topaz, amber, sapphires and all glistening stones.
  If born on June 28th , moonstones, "cat's eyes" and pearls can also be employed.`,
      climactericYears: `The most important or climacteric years of your life are the 1st , 4th , 5th , 10th , 13th , 14th .
  19th , 22nd , 23rd , 28th , 31st , 32nd , 37th , 40th , 41st , 46th , 50th , 55th , 58th , 59th , 64th , 68th and 73rd .`,
       magneticAttraction: `You will find yourself much attracted to persons born on the series of the "one", "four" or "five" in any month of the year, such as the 1st , 4th , 5th , 10th , 13th , 14th , 19th , 22nd , 23rd , 28th and 31st .
  If born on June 28th , those born as well on the series of the "two hyphen seven" (2-7), such as the 2nd 7th , 11th , 16th , 20th , 25th and 29th .`
     },
  
  
     2: {
     character: `Persons Born on June 2nd , 11th , 20th , 29th Number 2 people in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon and Neptune with Mercury (Positive), in the Zodiacal Sign of Gemini, First House of the Triplicity of Air.
  If born on June 29th , you come under the Sign of Cancer, First House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June.
  In your case the more gentle and imaginative qualities will be the dominant ones.
  You will be generally very responsive to "new thought" and new ideas.
  You will have broad views and sympathy for others.
  You will have a distinct aversion to fighting, quarrelling or war any form, and will be good in diplomacy or in settling troubles by negotiation, but you will often get involved in difficult situations.
  You should try to follow some diplomatic, artistic or professional occupation.
  You will have a great love for books, literature and history.
  You will travel a great deal and make many changes of place and residence.
  You will be warm-hearted, sympathetic to others and intensely human.
  You will have a very receptive mind and keen intellect.
  You will derive great happiness from books and delving in libraries and should make a success in literature.
  Any routine or business life would not be in your line of work.
  If you had to do something for a living you would do well in secretarial work for writers, or with artistic people, or in literary work on your own account, especially of the imaginative order.`,
       finance: `Finance: If born on any of these dates in June, in the matter of finance you cannot be too prudent.
  You will not be really fitted for "money grubbing" in any of its forms.
  You belong more to the mental, intellectual plane and will care little about wealth if you can only have enough for your immediate wants.
  You belong to the hopeful class of individuals who are rather inclined to live in dreams but often your dreams are likely to become great realities.`,
       health: `Health: This combination does not promise that you will be very robust or physically very strong; the upper stomach will be liable to be delicate and it would be well for you to study diet carefully and select food that suits you personally.
  If you do this you are likely to avoid serious illness and have a long life, although perhaps never a very strong one.`,
       importantNumbers: `Your most important numbers and dates for carrying out your plans and ambitions are the 2nd , 5th , 7th , 11th , 14th , 16th , 20th , 23rd , 25th and 29th .`,
       colors: `To increase our magnetic vibrations you should wear, at least in some part of your clothing, the colours belonging to your main planets, which are: The Moon: All shades of green, cream and white.
  Neptune: All shades of dove-grey and electric colours.
  Mercury: All light colours and bright shimmering materials.`,
      jewels: `Your "lucky" jewels are jade, moonstones, cat's eyes, pearls, sapphires, diamonds and glistening stones.`,
        climactericYears: `Your most important or climacteric years in life are the 2nd .
  4th , 5th , 11th , 13th , 14th , 20th , 22nd , 23rd , 29th , 31st , 32nd , 38th , 40th , 41st , 47th , 49th , 50th , 56th , 58th , 59th , 65th , 67th and 68th .`,
       magneticAttraction: `You will be much attracted to persons born on any of the series of the 2nd , 5th and 7th in any month of the year, also those born on the number "one" and "four" series, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st .`
     },
  
  
     3: {
     character: `Persons Born on June 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology, and my system based on Chaldean Numerology, you come under the vibrations of Jupiter, with (Mercury (Positive), in the Zodiacal Sign of Gemini, First House of the Triplicity of Air.
  If born on June 30th , you come under the Sign of Cancer, First House of the Triplicity of Water, whose ruler is the Moon and Neptune.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June, but the stronger qualities indicated will in your case be the most manifest.
  Ambition to bring your work to a successful issue will be your most dominant characteristic, but in it, although you may reach great heights, you will never be satisfied, but will keep on in mental activity to the end of the chapter.
  You will have considerable organizing ability, and would do well as the head of large businesses, positions of authority under governments municipal bodies, large corporations and such like.
  In a minor way you would make great success as a traveller or representative of commercial houses and in the presentation of new inventions.
  You will make friends wherever you go and will dominate persons quickly and easily.
  Your mentality will be extremely versatile with power and ability to hold and audience or talk on any subject.
  you will have a turn of mind of the inventive order, likely to take an interest in all matters concerning air travel, wireless, television, or researches dealing with such matters.
  You should be fortunate in dealing with such things, also in literary and scientific work.
  You will love quickness and speed in dealing with movement, locomotion and the annihilation of distance.`,
       finance: `Finance: In matters of finance you should be able to make money easily to accumulate wealth and gain high positions, but in such things you will never be satisfied, always craving for "the something just beyond".
  You will be most generous in money matters, but inclined to deplete your own reserves by giving to benevolent institutions and helping your own relations and those of your family by marriage.`,
      health: `Health: In health you will be inclined to have periodical breakdowns from overwork or exhaustion of the nervous system.
  You will fall ill quickly, but will recover just as rapidly.
  You will be likely to suffer from severe headaches, neuralgia, neuritis and trouble with the lungs or breathing apparatus in general.
  You should take exceptional care of your eyes and if you have to wear glasses you should have them changed often, so as not to strain your eyesight.
  You will have a very wiry constitution, capable of sustaining long period of fatigue.`,
       importantNumbers: `Your most important numbers and dates are "threes" and "Fives" and all their series, such as the 3rd , 5th , 12th , 14th , 21st , 23rd and 30th .
  If born on June 30th you can also use the "two hyphen seven" (2-7) series such as the 2nd , 7th , 16th , 20th , 25th and 29th .`,
     colors: `To increase your magnetic vibrations you should wear, at least in some part of your clothing, the colours of your important planets, such as Jupiter: All shades of violet, mauve or violet-purple.
  Mercury: All shades of light colours and glistening materials.
  If born on June 30th you can add to these all shades of green.`,
       jewels: `Your "lucky" jewels are the amethyst, all purple stones, diamonds and glitening stones.
  If born on June 30th , pearls, moonstones, "cat's_eyes", associated with the amethyst and purple or violet coloured stones.`,
       climactericYears: `The most important or climacteric years of your life are the 3rd , 5th , 12th , 14th , 21st , 23rd , 30th , 32nd , 39th , 41st , 48th , 50th , 57th , 59th , 66th , 68th , 75th and 77th .`,
       magneticAttraction: `You will be much attracted to persons born on "threes" and "fives", such as on the 3rd , 5th , 12th , 14th , 21st , 23rd and 30th in any month of the year.
  If born on June 30th , also persons born on the "two hyphen seven" (2-7) such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
     },
  
  
     4: {
      character: `Persons Born on June 4th , 13th , 22nd Number 4 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus and the Sun, with Mercury (Positive), in the Zodiacal Sign of Gemini, First House of the Triplicity of Air.
  The basic foundation of your disposition is described in preceding pages, but in your case the characteristics will be very much accentuated.
  The influence of Uranus and Mercury being a combination distinct and out of the ordinary, your life may be expected to run on most unusual lines.
  You will be very individual in character.
  You will like peculiar people and things, and it will be the sudden and unexpected that will play the greatest role in your life.
  You will display great originality in all you undertake.
  You are likely to have remarkable intuitions or "hunches".
  To be very inventive and attracted to new ideas, reforms in social life and out of the way studies.
  You will be attracted to such subjects as electricity, television, thoughtransference, telepathy, inventions relating to the air and air travel.
  You are likely to experience danger from airplanes, cyclones, lightning and all things associated with the air.
  You will have peculiar ideas about religion, government problems and social questions.
  Marriage is not likely to be favourable unless you have the good fortune to meet a person of the opposite sex who is of the same way of thinking as yourself.
  You will be likely to be attracted to some branch of mysticism and if so, you will have the ability to bring it before the public by literary work and perhaps lecturing.
  You are likely to have a considerable amount of annoyance and trouble by relations; on account of your very independent character you will be disposed to separate from them and live your own life.
  You will be liable to be brought into much litigation which you should avoid if possible.`,
        finance: `Finance: In matters of finance you also come under peculiar and rather uncertain conditions.
  You may gain money in fits and starts, but you will not be likely to keep it.
  Your ideas are liable to be too advanced for the generation you will live in.
  You will have a desire for indulging in speculation, but as a rule you will be disposed to "back the under dog' and may not be able to hold on long enough to see him come to the top.
  Your best chances should lie in relation to new ideas, such as electrical inventions, wireless, radio, television, telephones, cinemas and unusual building or construction work, also in literature or highly imaginative creations.`,
       health: `Health: You will come under very peculiar conditions as regards health.
  You are not likely to be robust, but have unusual ailments of mysterious kind.
  You will not be easily influenced by doctors and will change them frequently.
  You will be unusually sensitive to drugs, the smallest amount having a great effect on your constitution.
  You will be prone to experiment a good deal on yourself, especially in connection with mental cures.
  You would make a good doctor of the "new school" type, but one that would meet with much opposition and misunderstanding.
  In spite of being more or less opposition and misunderstanding.
  In spite of being more or less "a creaking door" you are likely to last a long time "on your hinges."`,
       importantNumbers: `Your most important numbers and dates are "fours" and "fives" and all their series, such as the 4th , 5th , 13th , 14th , 22nd , 23rd and 31st .
  The "number three" and its series, such as the 3, 12, 21, 30 is likely to crop up often in your life, also persons born on these dates, but under circumstances more in opposition to you than otherwise.
  You should be guarded against making use of this number or any of its series.
  You should also avoid the number eight and its series, such as 8, 17 and 26.`,
      colors: `To increase your magnetic vibrations you should wear, at least in some part of your clothing, the colours of Uranus and Mercury, which are: Uranus: All shades of grey and electric shades.
  Mercury: All light colours.`,
      jewels: `Your "lucky" jewels are sapphires, diamonds and all white or glistening stones.`,
      climactericYears: `The most important or climacteric years in your life are the 4th , 5th , 13th , 14th , 22nd , 23rd , 31st , 32nd , 40th , 41st , 49th , 50th , 59th , 67th , 68th , 76th and 77th .`,
      magneticAttraction: `You will be much attracted to persons born on the series of "fours" and "fives", such as the 4th , 5th , 13th , 14th , 22nd , 23rd or 31st in any month of the year, also persons born on the "number one" series, the 1st , 10th , 19th and 28th .`
     },
  
  
     5: {
      character: `Persons Born on June 5th , 14th , 23rd Number 5 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury in its own House of Mercury (Positive), in the Zodiacal Sign of Gemini, First House of the Air Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June.
  In your special case, because of the planet Mercury being in its own House forming in this month "a double Mercury," it accentuates the Mercurial influence if Your birth date is on the 5th , 14th or 23rd of June.
  Your brain will be extremely active, resourceful, quick in thought and action, especially in the way you will resent plodding and monotonous work.
  You will not easily find partners or associates with whom you can continue for long, consequently you may expect many changes to influence your life or career.
  All schemes of the "get rich quick" type will attract you, especially if born about the middle of the month.
  You will be of a speculative turn of mind, inclined to take risks on the stock exchange or any business that promises immediate turn- over of money.
  At times you will have great success, followed by many reverses of fortune.
  You should, in consequence, endeavour to put money aside for the bad periods which must eventually come, unless you were born into wealth and property controlled by others.
  You will be extremely restless, continually making homes, but not living long in them.
  You will have a great desire for travel, ready at a moments notice to leave wherever you are and prone to take the speediest means to get to your destination.
  Travel by air, express trains and rapid motor cars will be part of your very existence.
  You will be ready at any moment to risk your life for speed.
  You will have many hair-breadth escapes, but as a general rule you will be lucky in such things.
  People will not interest you for very long.
  You will be exceptionally generous in your impulses, but "out of sight, out of mind" will be one of your main characteristics.
  Your nature will be dual or two-sided, nearly always engaged in two or more things.
  You will be inclined to love two persons at the same time, and not be able to decide which one you desire the most.
  You are likely at some part of your life to keep up two homes, and make two marriages.`,
       finance: `Finance: In matters of finance your quick-witted clever brain will give you great opportunities.
  At times you are likely to be very rich and at other times the very reverse.
  When you have money you will be extravagant, when without it you can adapt yourself to the lowliest sphere.
  In fact, the greatest danger is that you are by nature too adaptable to others as well as to conditions.
  If you made the effort to hold your nature in check, you would easily become a success in whatever enterprise, industry, or work you became associated with.
  This is a remarkably good combination for all persons who have to come before the public.`,
       health: `Health: In the question of health you will be inclined to be your own worst enemy.
  You will have an excellent constitution, but of the highly-strung type.
  You will take too much out of yourself in every possible way.
  You will be prone to live in your nerves and crave for change and travel.
  In order to "keep going" you will be liable at times to indulge in stimulants which will injure your digestive organs.
  As you will detest rules and regulations, you will not be inclined to be regular in your habits, but may eat at any time of the day and night and only sleep as and when you can.
  In this way you are likely to break up the splendid constitution you would otherwise have.
  You will be liable to have trouble brought on by "nerves", twitching of the eyelids, some defect in the tongue or speech, blood disorders, eczema and skin eruptions.`,
      importantNumbers: `Your most important number is the "five" and all its series, and the dates of the 5th , 14th and 23rd .`,
       colors: `Your colours are those of Mercury-All light colours and glistening materials.`,
      jewels: `Your "lucky" jewels are diamonds, white sapphires and all white and glittering stones.`,
        climactericYears: `Your most important or climacteric years of life are the 5th , 14th , 23rd , 32nd , 41st , 50th , 59th , 68th and 77th .`,
       magneticAttraction: `You will be attracted to persons born on the 5th , 14th and 23rd of any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on June 6th , 15th , 24th Number 6 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and mercury in the Sign of Gemini, First House of the Air Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June.
  In Your special case, if born on any one of these dates, you come under a very fortunate combination, as far as being brought before the public is concerned.
  You will be likely to gain money from more than one source and to have great opportunities brought into your life.
  One class of this planetary combination is decidedly imaginative and succeeds in all things relating to music, art, or literary work, also as good lecturers and eloquent preachers.
  If born on the 6th , 15th and 24th of June, you can expect social success and prominence in the world, but with an undercurrent of fatalism which will make you, at times, pass through periods of gloomy forebodings and melancholia.
  You will have strong magnetism, be most attractive to your opposite sex, have many unusual love affairs and romances and go through an eventful life.
  You will have a dislike to any form of restraint, a great desire for independence and ambition to rise in life above your fellows.`,
       finance: `Finance: In all questions of money you will be more likely to be lucky than otherwise; to have many presents given you and properties or legacies left to you.`,
      health: `Health: In all matters of health you will be liable to suffer from over-strung nerves, together with spasmodic attacks of hay-fever, inflammation of the bronchial tubes and asthma.`,
       importantNumbers: `Your most important numbers and dates are the "sixes" and "fives" and all their series, such as the 5th , 6th , 14th , 15th , 23rd and 24th .`,
       colors: `To increase your magnetic vibrations you should wear the colours of: Mercury: All light shades.
  (If a women, glistening materials as much as possible) Venus: All shades of blue, from the lightest to the darkest.`,
       jewels: `Your "lucky" jewels are diamonds, pearls, emeralds, turquoise, blue stones of all kinds, crystals and those of a white glittering nature.`,
       climactericYears: `The most important or climacteric years in your life are the 5th , 6th , 14th , 15th , 23rd , 24th , 32nd , 33rd , 41st , 42nd , 50th , 51st , 59th , 60th , 68th , 78th .`,
       magneticAttraction: `You will be attracted to persons born in the series of "fives" and "sixes" in any month of the year, such as the 5th , 6th , 14th , 15th , 23rd and 24th .`
     },
  
  
     7: {
      character: `Persons Born on June 7th , 16th , 25th Number 7 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon and Mercury, in the Sign of Gemini, First House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons in June.
  In your special case your nature will be exceptionally receptive to the ideas of others, although this side of your character you may cover up under a somewhat brusque dictatorial manner.
  At heart you will be gifted with unusual ideality, great delicacy of feeling, refinement of thought, poetical imagination, visions and presentiments of things about to happen.
  You will be deeply attracted to mysticism and will have many unusual experiences in connection with such things.
  Your ambitions are not those of the world at large, but they will be equally strong in your mental efforts to influence those around you.
  You would do well in some form of "new thought", mental science, faith healing and such like studies, and could either talk well or write successfully in connection with such subjects, or again you may be disposed to hide these characteristics from people in general.
  You will have a strong desire to take long journeys, especially by water and you would always find your most congenial surroundings in livid by or near oceans, seas, river or lakes.
  This planetary combination gives considerable danger of accidents by water and death by drawing.
  From a material standpoint, your home life is likely to be much disturbed by troubles chiefly caused by close relations.
  Marriage is not likely to be very favourable and you will be much misunderstood in connection with such matters.
  You should endeavour to put aside money for your advanced years as much as possible, for you are under a planetary combination that lays you open to be swindled by designing unscrupulous people.
  You will have a deep love of nature in all its forms, great taste in art, with a strong desire to collect odd and beautiful things.
  This was decidedly exemplified in Lord Kitchener's career, born June 16th .
  He made a remarkable collection of Chinese vases.
  If born on June 25th on the "cusp" of Cancer, First House of the Triplicity of Water, you will all the more have the "wanderlust" in your blood, and love change and ocean voyages.`,
      finance: `Finance: You are likely to have peculiar experiences in money matters.
  You will be cheated out of money left you by will and may have a hard time in getting in anything due to you.
  Finances will be very uncertain.
  You should never indulge in speculation, but hold on carefully to anything you have.`,
       health: `Health: In health you are liable to have some peculiar experiences through the mind acting on the body.
  The stomach and digestive organs would be easily upset by worry or unhappy surroundings.
  Mental depression and a melancholy tendency will be inclined to come on periodically and will affect your general state of health.
  You will be subject to colds and delicacy of the lungs, also rather poor circulation of the blood.`,
       importantNumbers: `Your most important numbers and dates are "twos," "fives" and "sevens" and all their series, such as the 2nd , 5th , 7th , 11th , 14th , 16th , 20th , 23rd , 25th and 29th .
  You should endeavour to make your appointments and carry out your plans on these dates.`,
      colors: `In order to increase your magnetism you should wear, or employ in some part of your apparel, the colours of your important planets, which are: Moon: All shades of green, cream and white.
  Mercury: All light colours and glistening materials.
  Neptune: All shades of dove-grey.`,
      jewels: `Your "lucky" jewels are green jade, pearls, moonstones and diamonds.`,
        climactericYears: `Your most important or climacteric years in life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
       magneticAttraction: `You will be attracted to persons born on the series of "twos," and "sevens" in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
     },
  
  
     8: {
      character: `Persons Born on June 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Saturn, with Mercury (Positive), in the Sign of Gemini, First House of the Triplicity of Air.
  If born on June 26th on the "Cusp" of Cancer, First House of the Triplicity of Water, the stronger qualities of your nature will be the most dominant.
  The basic foundation of your character and disposition is described in preceding pages for persons born in June.
  In Your special case the more fatalistic of the qualities described will make themselves manifest.
  All your work will be marked by strong individualism.
  You are likely to be very much a "Child of Fate" influenced by circumstances and conditions over which you will have little or no control.
  You will be liable to be drawn into unfortunate legal matters that will be inclined to turn adversely, unless you take the greatest care and precaution.
  You may expect in a large measure to be forced to defend yourself against calumny, scandal and underhand enemies and to have trouble with neighbours, kindred and close relations.
  You will feet you have very few friends on whom you can depend in any crisis.
  If you could get free from restricting surroundings and be independent of other people's affairs, you could expect considerable success, especially in such things as science, mathematics, serious literary work and study of a philosophical nature, or some form of religion.
  You will be better alone in whatever your occupations or desires may be, as you will be inclined to be much misunderstood by others.
  You will be a deep thought full student of any subject you make your own, and will have unusual intellectual powers if you make the effort to develop them.
  You will be very observant of details and little things that go wrong will irritate you considerably.
  You will be fond of all forms of "advanced thought" but will find your views very much at variance with those around you.
  You will have to develop a philosophical outlook on life in order to sustain you in the trials and misunderstandings you are likely to come up against.
  You should avoid travelling by air as much as possible.`,
       finance: `Finance: You will be prudent and cautious as regards money.
  You will like quiet, serious methods in business and will build up your finances slowly and in some ways painfully.
  You will be reserved and secretive, trusting very few people.
  In spite of all your precaution, you will undergo losses and will be likely to experience robbery from servants and hirelings wherever you may live.`,
       health: `Health: In health the nervous system will cause you the most trouble.
  You will get easily upset by annoyances, anxieties or depressing influences which will be inclined to make your too introspective and have a bad effect on your health.
  You will be likely to have trouble with the intestines, and suffer with poisoning of the blood and auto-intoxication.
  You should eat plenty of fibrous vegetables and drink large quantities of water.
  You will be prone to suffer from severe headaches, especially at the base of the brain.
  You should have your eyes well looked after.`,
       importantNumbers: `Your most important numbers and dates are "eights" and "fours" and all their series, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .
  The numbers of "eight" and "four" and their series will play the most important part in your affairs, especially if born on June 26th , but you should avoid using them as much as possible when acting on matters coming, as it were, from yourself.`,
       colors: `To increase your magnetic vibrations you should avoid using all heavy dark colours and confine yourself to employing light shades.`,
      jewels: `Your "lucky" jewels are black pearls, black diamonds, dark sapphires.`,
       climactericYears: `The most important or climacteric years of your life are the 4th , 8th , 13th , 17th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 62nd , 67th , 71st , 76th and 80th .`,
      magneticAttraction: `You will be attracted to persons born on dates making "fours" and "eights" in any month of the year.
  If born on June 26th , the series of the "two hyphen seven" (2-7) will also be very important and such dates as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
     },
     9: {
      character: `Persons Born on June 9th , 18th , 27th Number 9 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars with Mercury (Positive), in the Sign of Gemini, First House of the Triplicity of Air.
  If born on June 27th , you will be at the commencement of the incoming Sign of Cancer, First House of the Triplicity of Water.
  This combination will give you a keen, sharp intellect, but will incline you to be combative mentally and argumentative in speech.
  You will be frank and outspoken and inclined to make enemies by "hiting straight from the shoulder." You will be inventive, mechanical and ingenious, with a love of chemistry, science and mathematics.
  You will be highly charged like a dynamo and "make sparks fly" all round you.
  You will cause much opposition from being too plain spoken and satirical in whatever you write and in your expressions in general.
  You will be inclined to have estrangements with your relations, trouble with brothers, sisters and members of your family.
  You will be versatile and clever, but not disposed for routine work.
  You will love independence and fight against any form of restraint.
  You will have many "ups and downs" in financial matters, but nothing will depress you or affect you for very long.
  You will have great courage in adversity; you may go down in a fight but will come up smiling every time.
  You are likely to have many affairs with your opposite sex and to have trouble through them.
  You will get into legal entanglements and be liable to lose by law, but largely caused by your own impetuosity and quick temper.`,
       finance: `Finance: Owing to your impulsive nature, you will be inclined to rush into schemes without careful consideration.
  In many ways, however, in inventions or businesses connected with risk or chance, you will be lucky.
  You will have clever original ideas as to "how things should be done", but as you are not likely to get on easily with partners you are liable to see many of your excellent plans come to nothing.
  Unless you make careful provision for the future your advanced years may not be favourable.`,
      health: `Health: You will be more liable to suffer through accidents than through ill health, to meet with injuries to the hips, shoulders, arms hands.
  You will be liable to meet with accidents caused by electricity, motors of all kinds and have considerable danger from matters relating to and from the air, and some danger from water if born on June 27th .`,
       importantNumbers: `Your most important numbers and dates will be "nines" and "fives" and all their series, such as the 5th , 9th , 14th , 18th , 23rd and 27th .
  If born on June 27th you will also be influenced by numbers and dates from the "two hyphen seven" (2- 7) series.`,
       colors: `To increase your magnetism you should wear, at least in some part of your clothing, the colours of your planets, which are: Mars: All shades of red, crimson and rose.
  Mercury: All light colours.
  If born on June 27th , you can add to these all shades of green and white.`,
      jewels: `Your "lucky" jewels are rubies, garnets, red or rose coloured stones of all kinds, diamonds and glittering things.
  If born on June 27th , you can use as well as the above, moonstones, pearls and "cat's eyes."`,
      climactericYears: `The most important or climacteric years of your life are more especially the 5th , 9th , 14th , 18th , 23rd , 27th , 32nd , 36th , 41st , 45th , 50th , 54th , 59th , 63rd , 68th and 72 nd .`,
       magneticAttraction: `You will be attracted to persons born on the series of "fives" and "nines" in any month of the year, such as the 5th , 9th , 14th , 18th , 23rd and 27th .
  If born on June 27th , substitute the series of "two hyphen seven" (2-7) for the number "fives," such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
     }
       }
   },
    july: {
    generalInfluence: `The zodiacal influence for the month of July in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Cancer, First House of the Triplicity of Water, commences on June 21st, but for seven days, being overlapped by the "cusp" of the previous Sign, it does not come into full power until on or about June 28th.
  From this date onwards it is in full strength until July 20th, and is then for seven days gradually losing its force on account of becoming overlapped by the "cusp" of the incoming Sign of Leo.
  Persons born in the "cusp" partake of the attributes of both Signs, the one they are leaving and the one they are coming into.
  The Sign of Cancer, or "the Crab" was so called by the ancients because the Sun at this time of the year appears to advance and retreat in the heavens like the movements of a crab.`,
  
  
    generalCharacter: `People born in this part of the year, namely from June 21st to July 27th, are painstaking and industrious in all they undertake, but are inclined to have extremes of good and bad fortune.
  In gambling in shares they generally lose, whereas in legitimate business work they can be most successful.
  They possess, however, as a rule, a keen desire for speculation and often lose business they have built up after years of hard work by this tendency in their nature.
  Like the symbol of "The Crab" they often advance and retreat both in work and ideas; they may reach a certain point in some definite plan or career and then surprise everyone by stopping or turning back at the most critical moment.
  As a rule they have great "ups and downs" in money matters, unless they have conquered their speculative tendency early in life and accumulated wealth and put it aside for the emergencies that must sooner or later crop up in their careers.
  People born in this part of the year often reach very high exalted positions or gain some pinnacle of fame where they cannot escape the dazzling light of publicity.
  In their home lives, however, they usually go through a great deal of trouble and are seldom surrounded by great happiness, no matter how successful they may appear in the eyes of the world.
  As a rule they are "dreamers" of large plans.
  They evolve big ideals for the welfare of others, but if they met opposition and criticism they suffer keenly, but silently, and are inclined to become cynical and shut themselves up in their own immediate surrounding.
  Although of a deeply affectionate disposition, they are seldom demonstrative and are wrongly considered cold and unemotional.
  They have large imagination and often make excellent artists, writers, composers, or dramatists and under some dates in this Zodiacal Sign, great organizers in industry or business.
  Generally they have splendid memories and store up knowledge of all kinds in their minds.
  They often make excellent psychics or become deeply interested in occult studies or in religion, or in some unusual philosophy of life.
  They have deep love for what they call "their own people," for family customs and for tradition.`,
  
  
    generalHealth: `Health: In health they should be particularly careful in what they eat, as they are liable to ptomaine poisoning, inflammation of the stomach and digestive tract, gastric attacks, internal tumours, cancer and dropsy.
  The influence of the Moon for persons born in this period of the year is inclined to play a considerable role, and renders the constitution somewhat delicate, but the delicacy is of a kind that can be mastered and held in check by the application will-power.
  The emotional nature, being stronger than the physical, most of the ailments will be brought about by ill-controlled feelings and morbid imagination.
  Worry, anxiety and fears for the future should be avoided as they only serve to bring on bad health.
  Persons born in this period of the year have a strong liability to suffer with rheumatism, gout and imperfect functioning of the blood circulation, and danger from chills and protracted colds, weakening the resistance of the lungs.`,
  
  
     generalFinance: `Finance: The influence of Neptune and the Moon will cause persons born in this part of the year to have many unexpected changes in their lives.
  They should look out for financial loss through the fraudulent conduct of others or companies and syndicates offering large returns for a small outlay.
  They should be very careful in all financial dealings, exercising special caution in the signing of papers, contracts, agreements and documents concerning which there is any element of uncertainty.
  Financial benefits accrue to them in most peculiar ways or by contact with peculiar persons.
  They often gain from some totally unexpected source and come into money by the most odd and peculiar means.
  They nearly always find success in investments connected with oil interests, refining of oil or coal, also with shipping, radium, platinum, electricity, antiques, curios and the importation of drugs and liquids.
  Also in public life and in positions of responsibility.
  Success by investing in large public utility companies and associations is generally good, but particular attention should be given to concerns which cater directly or indirectly for the needs and requirements of the masses at large.
  Persons born in this period of the year are often successful as pioneers and explorers and in the opening up and development of land, and mines of all kinds.`,
  
  
    generalMarriage: `Marriages, unions, partnerships, etc.: They will find their most harmonious relationships with persons born in their own Sign of Cancer, June 21st to July 20th, First House of Water; October 21st to November 20th, Sign of Scorpio, Second House of Water; and February 19th to March 20th, Sign of Pisces, Third House of Water, and in the seven days of the "cusp" at the beginning or ending of each of these periods.`,
  
  
    numbers: {
     1: {
      character: `Persons Born on July 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus, Neptune and the Moon in the Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July.
  In Your special case, if born on 1st, 10th, 19th or 28th of July, the stronger qualities described will be more dominant in your life and career.
  The planets which govern your individuality in this Sign of Cancer will incline you to have many changes in your career or position.
  You will have many strange adventures and experiences and will be greatly influenced by your surroundings.
  You will be much attached to your home and family, conscientious in your actions and patriotic to the country you belong to.
  If born on any of the above dates it gives good promise of advancement in life.
  You will have by nature a quiet reserved but very sensitive disposition, and yet in apparent contradiction to this, you will have a great deal of publicity brought into your life whether you seek it or not.
  You will be prudent and conscientious with a strong desire to accumulate money, but more as a protection than from the love of wealth.
  At heart you will have a deeply religious nature, but one more inclined to some simple form of faith not based on show.
  If you become rich, although you may live in an unostentatious way, you will be likely to employ your wealth in building or supporting large institutions for the benefit of humanity in general.`,
  
  
       finance: `Finance: There are two classes of persons born on the 1st, 10th, 19th, and 28th of July who are distinctly different in their outlook on the financial side of life.
  One is the "proverbial rolling stone that gathers no moss," the restless type of individual that cannot remain long at any one thing or in any one place-a person with the fever of wanderlust in his or her blood, that must travel and change and seek adventure at any cost.
  One can easily recognize this type by a restless look in their eyes, continual movements of the hands and feet and an impossibility of sitting still for any length of time.
  This class of "number one" man or woman seldom "makes good." The other type is the very reverse-quiet, reserved, showing great love of home and family, a traveller also, at times, but with some definite object or purpose; a sincerely conscientious person, one who says little but accomplishes much.
  These two contradictory types are more found born in this period of the year than under any of the other Signs of the Zodiac.
  To the restless type, finance will always be a difficulty; to the other, it will be a problem to be solved by patience and conscientious work.`,
  
  
       health: `Health: You will have great underlying vitality and yet not appear to be physically very strong.
  You will be liable to trouble in the digestive organs and intestinal tract.
  You are, however, likely to become your own physician and by a study of diet to keep all your ailments in check and surprise your friends by your vitality and length of life.`,
  
  
      importantNumbers: `The most important numbers and dates in any month, for both these types, will be the 1st, 10th, 19th and 28th, also the 2nd, 4th, 7th, 11th, 13th, 16th, 20th, 22nd, 25th, 29th and 31st.
  You should try to use these dates in endeavouring to carry out your most important plans or engagements, but avoid all numbers making a four or an eight as much as possible.`,
  
  
       colors: `To increase your magnetic vibration you should wear, in some part of your clothing, the colours belonging to your planets, such as the: Sun: All shades of gold, yellow, orange or golden-brown.
  Uranus: All shades of electric blue or greys, or blue-greys.
  Moon: All shades of green, creams and white.
  Neptune: All shades of dove-grey and electric shades.`,
  
  
      jewels: `Your "lucky" jewels are diamonds, topaz, amber, sapphire and moonstones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 2nd, 4th, 7th, 10th, 11th, 13th, 16th, 19th, 20th, 22nd, 25th, 28th, 29th, 31st, 34th, 37th, 38th, 40th, 43rd, 47th, 49th, 52nd, 55th, 56th, 58th, 61st, 64th, 67th, 70th, 82nd, 85th and 91st.`,
  
  
      magneticAttraction: `You will find a magnetic attraction to persons born on dates that make a "one", "two", "four" or "seven" in any month of the year, such as the 1st, 2nd, 4th, 7th, 10th, 11th, 13th, 16th, 19th, 20th, 22nd, 25th, 28th, 29th and 31st.`
     },
  
  
     2: {
     character: `Persons Born on July 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon, Sun, Uranus and Neptune in the Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages born in July.
  In your case the more imaginative qualities will be the most manifest.
  You will have great dreams of what you want to accomplish and the chances are that you will carry them out.
  You will be an enthusiast in every side of your work, and at times extremely dictatorial in "laying down the law" for others to follow.
  You will create "dramatic situations" in which you will play the leading role and come into the limelight of publicity.
  You will be innately artistic, romantic and sentimental, fond of all the Arts, especially poetry, literature, music and the theatre.
  You will have much ability to appeal to the emotions and sentiments of others.
  You will dislike any form of a monotonous existence.
  You will love the sea and ocean travel in dealings with other countries and you should do well in connection with such things.
  At times you will be aggressive in your manner and make enemies by your brusqueness in speech.
  As a writer, musician or artist you would show great imagination and would have much versatility in such things.
  You will be fond of curios, antiques, odd pieces of furniture and will accumulate as much of such things as possible.
  You will love to live near lakes, rivers and oceans; will be a devoted reader of travel stories of all kinds and store up a fund of information regarding foreign countries.
  You will carve out some distinct path of your own and will be likely to reach some position of prominence in whatever career you choose to follow.`,
  
  
      finance: `Finance: In regards to the question of finance, changeable conditions will also apply.
  There is likely to be a general feeling of uncertainty, giving way to a desire to take a jump at any chance to make money that comes along.
  This is likely in the end to become a kind of "vicious circle" which is inclined to become worse as one gets older.
  If born on the dates mentioned, you should exercise extreme caution in dealing with financial matters.
  You should avoid speculation and all forms of gambles.
  You should endeavour to build up your reserves no matter how slowly.
  Avoid all "get rich quick" schemes and if possible become associated or work for solid established business.
  Your planetary conditions favour such things as shipping, exports and imports, and transportation of goods or people, or the opening up of undeveloped countries.`,
  
  
       health: `Health: For persons born on the 2nd, 11th and 20th of July, health is a difficult point to analyse.
  They will be either extremely strong and robust, or the very reverse.
  The 29th of July, although a Number Two person, comes under a different classification.
  At this date they have already entered the next Zodiacal Sign of Leo the Lion, a sign of great possibilities, but they must be aroused by strong ambitions to make the most out of their lives.
  If you were born on the 2nd, 11th or 20th of July, the influence of the Moon will play an important role in regard to your conditions.
  You will be extremely sensitive to your surroundings; if these are fortunate and congenial you will probably get through life without much trouble from illness of any kind.
  If, on the contrary, you are forced to live under depressing or unhappy conditions, you will be liable to suffer a great deal from bodily ills.
  In other words, with you it will be largely a question of the effect of "mind over matter".
  The general tendency will be for almost unaccountable pains and cramps in the internal organs.
  There will be some likelihood of tumours, lesions and adhesions in connection with the intestines.
  Both men and women born on the dates mentioned in July would find it greatly to their advantage if they lived on a very simple diet and drank large quantities of pure water as much as possible.`,
  
  
       importantNumbers: `Your most important numbers and dates for carrying out your plans or engagement are the 1st, 2nd, 7th, 10th, 11th, 16th, 19th, 20th, 25th, 28th and 29th.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours belonging to your most favourable planets, which are: The Moon: All shades of green, creams and white.
  The Sun: All shades of gold, yellow, orange to golden brown.
  Neptune: All shades of dove-greys and electric shades.`,
      jewels: `Your "lucky" jewels are jade, pearls, moonstones, topaz, amber and diamonds.`,
  
  
        climactericYears: `Your most important or climacteric years in life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one", "two" or "seven" in any month of the year, such as the 1st, 2nd, 7th, 10th, 11th, 16th, 19th, 20th, 25th, 28th and 29th.`
     },
  
  
     3: {
     character: `Persons Born on July 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Jupiter, Neptune and the Moon, in the Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July, but in your case the combination of Jupiter, the Moon and Neptune will accentuate your individuality and incline your life and career to a more ambitious grade than otherwise, especially so if born on July 30th.
  You will be very independent in spirit, fearless and courageous in your views and opinions, yet generous, charitable and sympathetic to others.
  You will be popular among both your inferiors and those of your own station in life, especially if you allow yourself to take the responsibilities that will be offered you from time to time.
  You will view life from a higher and more intellectual standpoint than most people, and you should do well in positions of authority over others and in public, municipal or governmental work of any kind, or as the head of large enterprises.
  You will have a very decided love for home and country and at the same time have a keen desire to extend your knowledge by travel and to investigate the conditions of other lands.
  You will be very successful in building up enterprises and businesses, but you may, however, just as easily go in for some professional life or take some public or political career.
  During your early years you will probably experience a hard upward climb and have to depend on yourself for everything you gain.
  If so, the road is likely to be arduous up to about your 30th to the 35th year, but from that out you should get the "turn of the tide" which will lead on to fortune.
  You may expect honours and positions of great responsibility to be offered you in whatever community or country you belong to.
  You will be intensely devoted to your home, your country and your people.`,
  
  
       finance: `Finance: In relation to finance you need have nothing to fear.
  Once the early part of your life is over you will begin to reap reward for the foundation you have laid and from that out you are likely to accumulate wealth and position.`,
  
  
       health: `Health: You will have a good constitution, well kept in hand by your cheerful, happy outlook on life.
  You will be abstemious and regular in your manner of living and have few serious illnesses, if any.
  You will go in for outdoor life as much as possible and could excel in such things if you could get the leisure to do so.
  Your greatest danger is that you will take too many responsibilities on your shoulders and shorten your life considerably by overwork.`,
  
  
       importantNumbers: `Your most important numbers and dates will be associated with the series of "three", "two" and "seven", such as the 2nd, 3rd, 7th, 11th, 12th, 16th, 20th, 21st, 25th, 29th and 30th.
  You should endeavour to carry out your plans and engagements on dates making these numbers in any part of the year.`,
  
  
      colors: `To increase your magnetic vibrations you should wear, as much as possible the colours of your most important planetary vibrations, which are: Jupiter: All shades of violet, mauve or violet-purple.
  Neptune: All shades of dove-grey and "electric shades".`,
  
  
      jewels: `Your "lucky" jewels are the amethyst and all purple coloured stones, diamonds, moonstones and pearls.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 3rd, 12th, 16th, 20th, 21st, 25th, 30th, 34th, 39th, 43rd, 48th, 52nd, 57th, 61st, 66th, 70th and 75th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three", "two" or "seven" in any month of the year, such as the 2nd, 3rd, 7th, 11th, 12th, 16th, 20th, 21st, 25th, 29th and 30th.`
     },
  
  
     4: {
     character: `Persons Born on July 4th , 13th , 22nd , 31st Number 4 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus, the Sun, Neptune and the Moon in the Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July.
  In your case the combination above mentioned will incline you to have a very unusual personality, but not an easy one to fit in with the eventualities that are likely to arise, or the persons you will be thrown into contact with.
  You will have a strong bent towards originality of thought and ideas, with a leaning towards eccentricity.
  You will be exceptionally sensitive and "touchy" in everything that concerns your feelings, sentiment or emotional nature.
  You will be liable to have considerable trouble and estrangement by, or through relations, and in domestic matters.
  You will be likely to have many law-suits and to experience great injustice at various times in your life.
  You should be most guarded and cautious in making partnerships, also in such matters as unions or marriages.
  You will be highly intuitive and likely to meet with strange experiences in such things as dreams, presentiments, etc.
  You will be apt to develop mediumistic gifts but will be so sensitive about such things that you will be apt to conceal them except to a select circle of friends.
  You will possess unusual mental ability and will rise to a high position in any career you make your own.
  You will have a great deal to put up with and not have an easy time even when most successful.`,
  
  
      finance: `Finance: There are very few persons you will care to become associated with in financial matters.
  You will take strong aversions, have intense likes and dislikes and you should let yourself be guided by your intuitions.
  It would be best for you to work out your plans alone.
  You are likely at times to strike some odd inventions that will be lucky for you, and you will be liable to make money in peculiar ways, off the beaten track.`,
  
  
       health: `Health: In health you will have many unusual experiences.
  You will find it difficult to get doctors to understand you.
  Many will treat you as hypochondriac and not believe the symptoms you describe.
  It will be the same with your own relations-you will be very much misunderstood.
  You should take great care in what food you eat, as you would easily get ptomaine poisoning.
  You should be extremely cautious of fish, lobsters, crawfish and crabs; mussels you should avoid.`,
  
  
       importantNumbers: `Your most important numbers and dates all through your life will be the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.`,
  
  
       colors: `The colours that would give you the best vibrations are shades of sapphire, or ultra-marine blended, if possible, or in combination with gold, bronze, yellow or orange.`,
  
  
      jewels: `Your "lucky" jewels are sapphires, pearls, diamonds and moonstones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th and 71st.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on these dates, but you will find that such people will play a more or less fatalistic role in your life or career.`
     },
  
  
     5: {
      character: `Persons Born on July 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury, the Moon and Neptune in the Zodiacal Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July.
  In your case the influence of Mercury, the Moon and Neptune will play an important role in your life.
  You will be extremely sensitive and impressionable to both people and surroundings.
  You will be readily responsive to all acts of kindness and praise and encouragement will be to your nature as water is to flowers.
  In your early years you will find it extremely difficult to acquire confidence in yourself and in your abilities, but once you "feel your feet", as the expression goes, you will go ahead and never alter in carrying out your purpose.
  You will have an extremely keen brain and an intense desire for intellectual things with great ambition to dominate others in whatever career you may choose.
  You will be spiritually inclined with an intense wish to investigate questions concerning the "world beyond" and to search for experiences on such lines of thought.
  Your greatest fault will be that you may let yourself go too far in forcing your plans to an issue, making enemies and bringing about great opposition.
  You will have a great longing for travel, especially by water and this you will satisfy as far as your circumstances will permit.
  In a material way, at times, you are likely to make lucky strikes in money, but will find great difficulty in keeping what you have made.
  You are likely to develop strong will, and self-confidence.
  With these two powerful weapons you can easily succeed in the battle of life on account of the unusual intellect you have been endowed with.
  You will have a great deal of tact and diplomacy when you wish to make use of such aids, and you could be very successful in a diplomatic career, provided it was important enough to stimulate your interest.
  You could readily adapt yourself to people of other countries and see their point of view, even when their ideas run contrary to your own.`,
      finance: `Finance: In questions of money making, you could be very successful if you follow your own intuitions and work "on your own".
  Your class of brain is of a very clever order but so quick and versatile that you would tire easily of any routine or monotonous life.`,
  
  
       health: `Health: You will have remarkable recuperative powers; would quickly recover from any illness no matter how grave.
  Your principal troubles will come from highly strung nerves and your inability to take sufficient rest or relaxation.
  You are likely in advanced years to suffer from a nervous twitching in the face and eyes and some danger of injury or paralysis in the legs and feet.`,
  
  
       importantNumbers: `Your most important number is the "five" and all its series, such as the 5, 14 and 23.
  Other Numbers that will effect you considerably are the series of "two" and "seven".
  You should endeavour to make your important engagements or plans on dates in any part of the year making the above series, such as the 2nd, 5th, 7th, 11th, 14th, 16th, 20th, 24th, 25th and 29th.`,
  
  
      colors: `Your most favourable colours are: Mercury: All light colours.
  The Moon: Creams, white and pale green.
  Neptune: All shades of dove-grey and pastel colours.
  You should not wear dark heavy colours of any description.`,
  
  
      jewels: `Your "lucky" jewels are diamonds, pearls, all kinds of white glistening stones and jade ornaments.`,
  
  
        climactericYears: `Your most important or climacteric years in life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 59th, 68th, 77th and 86th.`,
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" such as the 5th, 14th, 23rd and the series of "two" and "seven" in any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on July 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus, Moon and Neptune in the Zodiacal Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July.
  Under the above combination you will have an interesting unusual life, but one in which love, romance and powerful ambition will play a considerable part.
  You will be kind hearted, generous, impressionable and extremely magnetic, but it is your ambition to make a success of whatever your career may be that in the end you will owe so much.
  You will have a considerable love for mystical things, but you will keep this well under control and not allow any form of idle superstition to gain a hold over you, but at the same time you will be a believer in Fate and feel that "there is a destiny that shapes our ends, rough hew them as we may".
  You will have much love for your family, especially the mother's side.
  You will further the interests of relatives in every way and not resent the load they will place on your shoulders.
  Marriage and your private home life is not likely to be especially fortunate.`,
  
  
      finance: `Finance: In financial matters you will be inclined to be more fortunate that otherwise.
  You will be lucky with your opposite sex; you will be likely to gain money by marriage, have property left you by legacies or create it by power of your own mentality.`,
       health: `Health: During your early years you will have an overabundance of robustness and vitality, but your good health you will be inclined to wreck by overwork and the high nervous tension under which you will be likely to live.
  You will be liable to have internal illness such as blockage of the intestines, tumours, appendicitis, hernia and such like complaints, but with the splendid constitution you have as foundation, all these things could be cured or at least held in check by careful living and simple diet.`,
  
  
      importantNumbers: `The important numbers and dates for persons born on the 6th, 15th or 24th of July are the "sixes", "twos" and "sevens" such as the 2nd, 6th, 7th, 11th, 15th, 16th, 20th, 24th, 25th and 29th.
  You should endeavour to carry out your plans and engagements on dates making these numbers in any part of the year.`,
  
  
     colors: `To increase your magnetic vibrations, you should wear the colours of: Venus: All shades of blue, from the lightest to the darkest.
  Moon: Greens, creams and white.
  Neptune: All shades of dove-greys and pastel colours.`,
  
  
       jewels: `Your "lucky" jewels are the turquoise, all blue stones, also emeralds.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 6th, 15th, 24th, 33rd, 42nd, 51st, 60th, 69th and 78th.`,
  
  
       magneticAttraction: `You will find a magnetic attraction to person born on dates making a "six" in any part of the year such as the 6th, 15th, 24th; also on dates making a "three" or "nine" such as the 3rd, 9th, 12th, 18th, 21st, 27th and 30th but the "nine" series will not be so favourable.`
     },
  
  
     7: {
      character: `Persons Born on July 7th , 16th , 25th Number 7 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune and the Moon in the Sign of Cancer, First House of the Water Triplicity.
  The basic foundation of your character and disposition is described in preceding pages for persons born in July.
  If you develop strength of character and will power, the above combinations will bring you great advantage over others by your intellectual attainments.
  You will be emotional, artistic and imaginative, with inspirational and psychic gifts of a high order.
  With such a background you could make a considerable success as a painter, writer, musician or composer, also an eloquent speaker or preacher; but as your desires do not belong to what is considered the material plane, unless you have means at your disposal, you are likely to find, especially during the early years, the gaining of money by your work a very difficult matter.
  You will have a great sense of refinement in your tastes and ideals, and no matter under what conditions your life started or from what surroundings, you will aspire to great things and will endeavour by reading and study to cultivate your mental qualities in every way.
  This Zodiacal and Planetary combination produces a philosophical and deeply religious nature.
  A good example of this may be found in the character of that noted American pastor, the Reverend Herbert Benton, born on July 7th, also that of Mrs.
  Mary Baker Eddy, the founder of Christian Science, born on another 7, namely July 16th.
  Those born on July 25th, being so far advanced in the "cusp" of the incoming Sign of Leo, the Lion, and the House of the Sun, are promised greater success from a material standpoint.
  They will be more drawn into the "limelight" of public affairs, but the philosophical tendency will still remain their background.
  All persons born on the 7th, 16th, or 25th of July have an earnest longing for travel by sea, or long journeys by land.
  If circumstances will permit them they become explorers or pioneers in unknown lands.
  Although possessed with a deep love of home, they will have unusual experiences in connection with such matters.
  If marriage occurs, it will be under peculiar conditions; the later in life it takes place the better would be the chances for success.
  You will have a strong desire to take long journeys, especially by water and you would always find your most congenial surroundings in living by or near oceans, seas, river or lakes.
  This planetary combination gives considerable danger of accidents by water and death by drowning.
  From a material standpoint, your home life is likely to be much disturbed by troubles chiefly caused by close relations.
  Marriage is not likely to be very favourable and you will be much misunderstood in connection with such matters.
  You should endeavour to put aside money for your advanced years as much as possible, for you are under a planetary combination that lays you open to be swindled by designing unscrupulous people.
  You will have a deep love of nature in all its forms, great taste in art, with a strong desire to collect odd and beautiful things.
  This was decidedly exemplified in Lord Kitchener's career, born June 16th.
  He made a remarkable collection of Chinese vases.`,
  
  
       finance: `Finance: On the question of finance I cannot give too much warning.
  Persons born on the 7th, 16th and 25th of July are likely to have most unusual experiences.
  They may find at times almost absolute strangers suddenly brought into their lives to take a violent interest in them or their talents, and to abandon them just as suddenly.
  They will find the same with relations; sometimes great interest shown and help rendered, and then again the very reverse.
  They are also likely to receive legacies, but with "a string tied to them." I would advise all such persons to endeavour to develop confidence in themselves, to steadily persevere in the talent they believe they possess, to "keep the lamp of hope and ambition" always burning in their hearts.
  If they follow this rule I believe that sooner or later their intellectual qualities will raise them to the position they desire.`,
  
  
     health: `Health: This is another of those periods of the Zodiac where the conditions of health are so much governed by the mind.
  If born on the 7th, 16th or 25th of July, you are not inclined to be physically so robust, but you will show great power of endurance if your brain has set itself to accomplish some decided object.
  Physically you will be included to have peculiar illnesses out of the ordinary run, also such things as tumours, lesion of the internal organs, long protracted colds, chills and influenzas.
  If you can, however, keep your mind in a happy, cheerful condition, these tendencies are likely to disappear, especially on account of your outlook on life.`,
  
  
      importantNumbers: `If born on the 7th, 16th or 25th of July, your most important numbers and dates are "seven" and "twos" and all their series, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.
  You should endeavour to carry out your plans or engagements on these dates in any part of the year.`,
  
  
       colors: `In order to increase your magnetic vibrations, you should wear or employ in some part of your clothing, the colours allotted to Neptune and the Moon, such as: Neptune: All shades of dove-greys and pastel colours.
  The Moon: All shades of green, creams and white.
  If born on July 25th you can also use all shades of gold, yellows to golden browns.`,
     jewels: `Your "lucky" jewels are green jade, moss-agate, moonstones, cat's-eyes, "mother of pearl" and pearls.`,
  
  
        climactericYears: `Your most important or climacteric years in life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th, 70th and 79th.`,
  
  
       magneticAttraction: `You will find a strong attraction to persons born on dates that make a "two" or "seven" in any month of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th; and if born on July 25th you will also be attracted to persons born on dates making the Sun numbers-the "one hyphen four" and their series, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.`
     },
  
  
     8: {
      character: `Persons Born on July 8th , 17th , 26th Number 8 People in This Month If you were born on July 8th or 17th, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibration of Saturn, Neptune and the Moon, in the Sign of Cancer, First House of the Triplicity of Water.
  The 26th of July is, however, distinct in itself, as the Sun, the Giver of Life, has at this date in July, left the Sign of Cancer, and entered the Sign of Leo, otherwise called the House of the Sun.
  I will therefore explain July 26th separately later on.
  The basic foundation of your character and disposition will be that described in preceding pages for persons born in July.
  In your special case, if born on July 8th or 17th, it will cause you individually to be a very serious turn of mind, with strong will and very decided in your opinions.
  Up to, on or about middle life, you are likely to have restrictions and responsibilities for others hamper and prevent your going ahead.
  You will be like a prisoner in a cage that can look through the bars at the world beyond and yet be unable to change your conditions.
  You will be more or less a "child of Fate" subject to circumstances made by other persons.
  You will be extremely serious and earnest in your emotions, but not demonstrative or able to express what is in your nature.
  You will be greatly sacrificed for others and get very little satisfaction or credit for what you do in your early years, and in matters of love or affection you will meet some very hard trials and heavy responsibilities.
  Up to about middle life you will be likely to encounter many restrictions in carrying out whatever your ambitions may be, but in the end there is every reason to expect that success will reward your determination and persistency.
  If born on the 8th or 17th of July, either of two things are likely to happen.
  You may be one of those persons forced by surroundings or family obligations into some routine career where you may remain for the greater part of your life, working for others; or you may belong to the more fortunate class born on the same dates who get the opportunity more early, to steadily accumulate money and become a kind of fatalistic power in the world of men.
  John D.
  Rockefeller, born on the 8th of July, 1839, is a good example of the latter case.
  At 17 years of age he was working as a clerk in a commission house.
  He saved up enough money in four years to become a partner, in another four years he joined an oil refiner, Samuel Andrews.
  In his 26th year the Standard Oil Refinery was born in Cleveland, which was the foundation of his fortune-one of the greatest in the world.
  It is estimated that this remarkable man's gifts to religious, philanthropic and charitable purposes, today, exceed the sum of Five Hundred Million Dollars.
  As a general rule, however, persons born on the 8th or 17th of July have a very difficult time in their early years.
  There is an axiom in Astrology laid down by ancient students of this science, that what is called a "Cycle of Saturn" lasts about thirty-three to thirty-five years; if a person born on one of the above dates finds this period of their life hard, if they hold out to the end of it they enter another, but more favourable cycle, for the next thirty-three to thirty-five years.
  Another curious thing about persons born on the number eight in July, such as the 8th, 17th, or 26th, is that they either have a deeply religious nature or the very reverse.
  People born on any one of these dates in this period of the Zodiac do best to engage in what may be termed "solid business" such as the opening up of land, mining, or dealing in oil or liquids extracted from the earth.
  The 26th of July, being on the "cusp" of Leo, the House of the Sun, is very favourable for those who lead a public life in municipal government affairs, or as preachers, ministers, authors, all those in fact whose work appeals to the public in general.`,
  
  
       finance: `Finance: In previous pages dealing with the dates of the 8th, 17th and 26th of July, I have said enough to show the general drift of the tendencies of persons born on these dates.
  I have gone very deeply into all questions relating to those born under the number "eight" in my "Book of Numbers".
  I would not have sufficient space at my disposal to enlarge more fully on the curious fatalistic meaning of this number in the pages of this present work.
  Born on any one of these dates your dogged persistency and determination will enable you to amass wealth and to hold it, provided you do not allow yourself at any time to get involved in speculative concerns.
  If you were born on the 8th, 17th or 26th of July, you will find the numbers of "four" and "eight" and all their series, very much drawn into your life, such numbers and dates and persons born in connection with them, playing a large role in your affairs.`,
  
  
      health: `Health: If you were born on the 8th, 17th or 26th July, you will be subject to illnesses that effect the digestive organs, the kidneys, liver and large colon.
  You will be inclined to accumulate a great deal of acidity in the system and suffer from arthritis and rheumatism, especially in the knees, ankles and feet.`,
  
  
      importantNumbers: `Your most important numbers are the "fours" and "eights" and all their series.
  I would advise you to look out for and avoid the number nine (Mars) as much as possible, such as the 9, 18 and 27, or dates making these numbers.
  As you will have a more or less fatalistic kind of life, it may be as well for you to make use of your own numbers and dates as much as possible, such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.
  If born on July 26th, the Sun coming into its own House will cause more importance to the numbers of "one" and "four," such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.
  But the "number eight," the number of Saturn, will remain fully equal in its importance.`,
  
  
       colors: `[The text does not explicitly specify unique colors for 8 in July, except the general advice in the main text to follow one's numbers.]`,
  
  
       jewels: `For "lucky" jewels you should wear black pearls, black diamonds, dark coloured emeralds or green stones, especially if set in silver or platinum.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th, 71st, 80th, 94th and 98th.`,
  
  
      magneticAttraction: `[The text refers to the numbers of "four" and "eight" and their series being drawn into the life, but does not explicitly provide a separate magnetic attraction section.]`
     },
  
  
     9: {
      character: `Persons Born on July 9th , 18th , 27th Number 9 People in This Month If you were born on July 9th or 18th (the 27th will be explained later) following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, You come under the vibrations of Mars, Moon and Neptune in the Sign of Cancer, First House of the Triplicity of Water.
  As Mars is considered in its "Fall" in Cancer, your life is likely to be full of contradictions and will require the development of strong will and character in the carrying out of your purpose of ambitions.
  You will be inclined to rebel against restraint and you will have to develop tact and prudence in dealing with others.
  You will be fearless and independent, but in your early life liable to outbursts of temper which you will have to keep well under control and make use of it as a driving power.
  You will be forceful and enterprising in all you undertake, with a kind of pioneering spirit, and a love of adventure.
  You may expect to have many changes of residence and not easily settle down for any length of time in any one place.
  You are likely to meet with considerable friction with relations and it would be better if you do not marry early.
  You will be liable to have a peculiarly eventful life as far as danger and accidents are concerned, especially from such causes as fire, firearms, cyclones, earthquakes and from the watery elements.
  You should always be well covered by insurance and put money aside for your advanced years, otherwise you are likely to meet with financial difficulties towards the end of life.
  You will be apt to have many law suits in the course of your life; as a rule you will lose by law and also by lawyers.
  If you were born on July 27th, the Sun having entered its own House at this period of the year, following the rules of Chaldean Numerology, you come under the vibrations of the Sun and Mars in the House of Leo the Lion.
  This is a very strong combination which you should expect considerable success and prominence in whatever career you undertake.
  You will be well fitted for positions of responsibility, high office and public approbation.
  You will have a sunny, cheerful disposition, optimistic and courageous, and will show your best qualities in moments of emergency or danger.`,
       finance: `Finance: In matters of finance you will either be a great success or a great failure.
  In your case there is not the likelihood of any "happy medium".
  You will go "the whole hog" or not at all.
  And yet you will have such enterprising ideas and plans for making big money that the chances are you will pull some of your schemes off and be rich, at all events in periods of your life.
  You should always be on your guard against troubles, difficulties or annoyances cropping up, in or about the following months every year-July, October, December and April.`,
  
  
        health: `Health: This is not such an important matter in your case, as you will have great vitality and recover quickly from any illness.
  What is important, however, is the danger of accidents that you will be liable to meet, especially those of injury to the legs and feet.
  You will also be likely to experience danger in travel, from train wrecks, motors of all kinds and on board ships.
  You should pay considerable attention to your eyes, as you will be liable to have trouble with them, and may have to undergo operations for cataracts and such like.`,
  
  
       importantNumbers: `Your important numbers and dates will be "nine," "two" and "seven", and all their series, such as the 2nd, 7th, 9th, 11th, 16th, 18th, 20th, 25th, 27th and 29th.
  You should endeavour to carry out your plans and engagements on dates making any of these numbers.
  Your important numbers and dates, if born on July 27th, are the "one", "four" and "nine" and all their series, such as the 1st, 4th, 9th, 10th, 13th, 18th, 19th, 22nd, 27th, 28th and 31st.
  You should endeavour to carry out your plans and engagements on dates making these numbers.`,
  
  
      colors: `To increase your magnetism you should wear in some part of your clothing the colours associated with the planets of: Mars: All shades of crimson, rose or reds.
  The Moon: All shades of green, creams and white.
  Neptune: All shades of dove-grey or pastel shades.
  If born on July 27th, to increase your magnetic vibrations, you should wear in some part of your clothing the colours of: The Sun: All shades of gold, yellow to golden brown.
  Mars: All shades of crimson, rose or red.`,
  
  
      jewels: `Your "lucky" jewels are the ruby, garnet and all red stones especially; next to these, but of not so much importance are pearls, moonstones and jade.`,
  
  
      climactericYears: `The important climacteric years for those born on July 9th, 18th and 27th, are the 1st, 9th, 10th, 18th, 19th, 27th, 28th, 36th, 45th, 46th, 54th, 55th, 63rd, 64th, 72nd and 73rd.`,
  
  
      magneticAttraction: `If born on any of the above dates in July you will find a strong magnetic attraction to persons born on a "nine" in any part of the year, such as the 9th, 18th 27th.`
           }
       }
   },
    august: {
    generalInfluence: `The zodiacal influence for the month of August in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Leo the Lion, commences on July 21st, but being overlapped by the "cusp" of the previous Sign, it does not come into full power until on about July 28th.
  From this date onwards it is in full strength until August 20th, it is then for seven days gradually losing strength on account of becoming overlapped by the "cusp" of the incoming Sign of Virgo.
  This Sign of Leo is also called the House of the Sun.
  Persons born in this period of the year, namely from July 21st to August 20th and in the "cusp" to August 28th, have strongly marked characteristics.`,
  
  
     generalCharacter: `They usually have large ambition, their aim is to get above the common herd of humanity and in no matter how low or humble the sphere of life into which they are born, they generally rise by their will, determination and ability, into high positions of authority in whatever career they adopt as their own.
  They are keenly attracted to other strong personalities, in fact they are ready to forgive any fault in others so long as they have individuality and purpose.
  People born in this period are large-hearted and generous.
  They have an extremely independent spirit, they detest control or being dictated to.
  They have much tenacity of purpose and will power, and if they put their mind on some plan, purpose or position, they usually reach their goal in spite of every difficulty or obstacle.
  They have wonderful magnetic power in inspiring others on to do great deeds.
  Like Napoleon, born in this Sign (August 15) they attract devotion from others and can lead people to follow them through the most difficult situations.
  Such persons must, however, be always actively employed.
  If forced by circumstances out of the heat and stress of the battle of life, they become morbid and despondent.
  As a rule they are extremely patient and long suffering, but if once aroused, like the lion they know no fear and do not know when they meet defeat or acknowledge it if it does come.
  They make enemies by their frankness of speech and their hatred of anything underhand or that savours of subterfuge.
  They will defend a friend in the face of all attacks; it is only treachery, disloyalty or deceit that can ever break or crush their proud spirit.
  People born in this period of the year, having the vital principle of the Sun's rays passing through the sign Leo at their birth, will manifest a high degree of ideality and aspiration.
  Being essentially large-hearted, honest and truthful themselves, they expect great things from those about them, and frequently get terribly disappointed and deceived.
  They radiate warmth, affection, kindness and a strong personal magnetism which makes them exceedingly popular.
  Highly susceptible to environment, they exhibit a strong tendency to take on the habit and conditions of others.
  Their exaggerated faith in human nature is their stumbling block in love and friendship, leading to many tragedies, heartaches and estrangements.
  They possess splendid organizing ability and great ambition, but are rather too apt to accept responsibilities and take too much on their shoulders.
  They must also guard against carrying the "regal attitude" to excess, or they become somewhat domineering.
  Always striving to raise themselves from the common herd, they are naturally attracted to strong personalities and those in high positions.
  They are intensely proud, determined, frank and straightforward, though somewhat impetuous and quicktempered.
  The will power is exceptionally strong and there is tenacity and great persistency if they feel they are in the line of work that suits them.
  They at times have a tendency to despondency and dissatisfaction for not having reached the high position to which they aspire, but as they represent what may be termed the heartforce of humanity, the keynote to their character in all its phases is magnanimity, consequently they blame no one but themselves for any short- comings they may have.`,
  
  
    generalHealth: `Health: The influence of the Solar Orb, the Giver of Life, upon this question renders the constitution strong and endows persons born in this period with good recuperative power, causing them to radiate vitality.
  Generally speaking, their chief physical trouble is likely to proceed from irregularity of the heart- beat which tends to affect the circulation.
  Discordant or inharmonious surroundings will also have a detrimental effect upon their health in general.
  The planetary influences governing a birth in this period of the year indicate, that at times they will be inclined to suffer with acute attacks of rheumatism when the fever will run dangerously high.
  Few illnesses are really indicated, but those that may come are generally difficult to cure.
  They will find sun baths beneficial, while plenty of fresh air will always do more good than drugs or physic.
  Grief or prolonged worry impairs their health more quickly than anything else.`,
  
  
    generalFinance: `Finance: Persons born in this period of the year are usually considered more fortunate than otherwise in all matters connected with finance.
  It promises success in any legitimate business they may go in for.
  Their financial prospects are hopeful and they are likely to gain through superiors and persons older than themselves.
  They quite often in their lives benefit through speculation and through judicious investment.
  Their financial plans and projects should be on a large scale and favour the patronage of the general public rather than the individual.
  Investments connected with gold mining, brass work, diamonds, provision import and export and dealings with governments or municipal bodies should bring them good returns.`,
  
  
    generalMarriage: `Marriages, unions and partnerships: People born in this part of the year find most harmonious relationships with persons born in their own Sign (Leo) July 21st to August 20th, Second House of Fire; November 21st to December 20th (Sagittarius), Third House of Fire; March 21st to April 19th (Aries), First House of Fire, and in the seven days of the "cusp" at the beginning or ending of these periods, also with persons born in the opposite part of the year, in this case those born from December 21st to February 19th.`,
  
  
    numbers: {
     1: {
     character: `Persons Born on August 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations on the Sun and Uranus in the Sign of Leo the Lion, Second House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in previous pages for persons born in August.
  In your special case the stronger qualities will be more dominant in your life and career.
  The above combination endows you with a quick, active mentality, will make you ambitious, determined in carrying out your plans, industrious, conscientious in work or promises, gives you a bright, sunny, happy disposition, a magnetic personality and much promise of success and honours in whatever zone of life you go in for, more especially so in government, municipal or public life, or in connection with fraternal societies and large organizations.
  The uranian side of your nature will endow you with unusual intuition, independence of views with originality and a "go-ahead" enterprising spirit.
  You will have strong likes and dislikes, you will be inclined to violent attachments and will be likely to make an early union or marriage.
  You will be easily angered, but just as quickly appeased.
  Your nature is an extremely conscientious one, capable of doing quietly an enormous amount of work.
  You will be fond of receiving honours and approbation from others and if born on the 1st, 10th, 19th, or 28th of August you are likely to be drawn into some form of political life.`,
  
  
       finance: `Finance: In matters relating to finance from a zodiacal standpoint you are under very favourable aspects.
  You may have to meet hardships and difficulties in your early years, but will forge ahead out of any unfavourable conditions and will have every prospect of becoming well off and gain power and position in any community where you may be.
  Your career will be divided as it were, into two zones.
  Up to about thirty-seven years plenty of hard work in overcoming difficulties, from thirty-seven to the end more or less prosperous and successful.`,
  
  
       health: `Health: In your childhood and early years you will be liable to have many minor illnesses, especially fevers, rheumatism, inflammation of the blood, carbuncles, boils, etc.
  But from about the 28th year the promise is that you will grow out of such things and become healthy and vigorous.`,
  
  
       importantNumbers: `Your most important numbers and dates are the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.
  You should use these dates as much as possible in carrying out your important plans or engagements.`,
  
  
       colors: `To increase your magnetic vibrations you should wear or have in some part of your clothing the colours of the Sun: All shades of gold, yellow, orange or golden brown.
  Uranus: All shades of grey, sapphire-blue and "electric colours."`,
  
  
      jewels: `Your "lucky" jewels are diamonds, topaz and sapphire.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 4th, 10th, 13th, 19th, 22nd, 28th, 31st, 37th, 40th, 46th, 49th, 55th, 58th, 64th, 67th, 73rd and 76th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or a "four" in any part of the year, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.`
     },
  
  
     2: {
     character: `Persons Born on August 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon, Neptune and the Sun in the Sign of Leo, Second House of the Fire Triplicity.
  If born on August 29th, you have already entered the incoming Sign of Virgo, Second House of the Triplicity of Earth.
  The foundation of your character and disposition is described in preceding pages for persons born in August.
  In your case the more intellectual side of the qualities described will be more manifest.
  The above combination under which you were born, is a very favourable one.
  It will uplift you mentally and socially, causing people to have trust and confidence in you and will bring many opportunities of advancement in whatever your career may be.
  You will be popular with your opposite sex, with idealistic love affairs and romances bringing strange and unusual episodes into your life.
  You are likely to exhibit considerable talent for art, literature, music or the drama.
  In any zone of life you occupy you will take a prominent position, and will show great tact, diplomacy and good management.
  You will be exceptionally loyal to your friends and to those who you love, so magnanimous and broad-minded, that you are not likely to make any serious enemies, even though they may disagree with your views.
  Your desire will always be to see the best in others and to bring out that best if you can help to do so.
  You should be able to develop gifts of eloquence or writing and you would succeed well as a preacher, evangelist, public teacher or as a judge.
  You will have very keen intuition about people in general, but not from any harsh critical standpoint, rather more to understand and to help them understand themselves.`,
  
  
       finance: `Finance: In all matters regarding financial questions will be rather fortunate and yet have little regard for the value of money.
  Money will come to you in strange ways, by gifts, legacies and wills, but you will be likely to impoverish yourself at times by your generosity.
  You are more likely to make money by your mental talents such as by your powers of speaking, art, music, writing or by some profession rather than by following a business life.`,
  
  
       health: `Health: You will have to be careful of your health and husband your strength as much as possible.
  You will be liable to delicacy of the lungs and throat, some irregularity of the heart and poor circulation of the blood.`,
  
  
       importantNumbers: `Your most important numbers and dates will be the "two hyphen seven" (2-7) and all their series, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th, in any part of the year with your secondary numbers of the Sun and Uranus, "one hyphen four" (1-4) and all their series, such as the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.
  If born on August 29th, this same combination will remain.`,
  
  
       colors: `To increase your magnetic vibrations you should wear at least in some part of your clothing the colours of: The Moon: All shades of green, creams or white.
  Neptune: All shades of dove-grey or "electric pastel colours." The Sun: All shades of gold, yellow, orange to golden brown.
  Uranus: All shades of grey and "electric or pastel colours."`,
  
  
      jewels: `Your "lucky" jewels are pearls, moonstones, jade, topaz, sapphire and amber.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a two or seven in any part of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th, and 29th, also with those born on the 1st, 4th, 10th, 13th, 19th, 22nd, 28th and 31st.`
     },
     3: {
     character: `Persons Born on August 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Jupiter, the Sun and Uranus in the Sign of Leo, Second House of the Fire Triplicity.
  If born on August 30th, being at that date at the commencement of the incoming sign of Virgo you come under the vibrations of Jupiter with Mercury (Negative), in the Second House of the Triplicity of Earth.
  The foundation of your character and disposition is described in preceding pages for persons born in August, but in your special case the combination of Jupiter with the Sun and Uranus will accentuate the points given in the general indications for those born in August.
  At the back of your nature is strong ambition, a soul force that will never allow you to be easily satisfied with ordinary success.
  You will sooner or later develop a keen desire to fill positions of prominence and responsibility in whatever community you may be a member of.
  You will be an intense worker in all your undertakings; if anything so overconscientious in your efforts and so unsparing of self that at times you may deplete your vitality.
  You will have great ideality, you will make many friends, but in your love-nature you will meet many disappointments and heart- breaks.
  The combination you were born under promises success in all forms of government employment or in political or municipal work of any kind, also on any career that would bring you before the public.
  You will show outstanding ability in positions of authority over others.
  You will gain the approbation of those around; on the contrary you need these things as a kind of stimulant to force you on still further.
  You will have a deep sincere affectionate nature, a keen sense of home life, a great love of children or the desire to train and bring them up.
  You will have lofty, noble aspirations.
  There will be some things "regal" about you even if you were born in a gutter.
  You will rise in life to hold high positions, your only danger being that your ambition has no limit.
  You are likely to take too much on your shoulders, to attempt undertakings that may become "top- heavy" and to kill yourself by overwork.
  You will be successful in your investments provided you follow your own intuitions and not allow yourself to be carried away by the flattery of fawning sycophants that you will be bound to meet with in such a career of yours.`,
  
  
      finance: `Finance: As a general rule you may expect by your own good judgment to steadily increase your wealth and financial position.
  You will have an almost uncanny vision as to the trend of events likely to affect commerce, industry and business.
  You will not be a hoarder of money, but will use it lavishly without wastefulness in the furtherance of large schemes.`,
  
  
      health: `Health: You should expect good health all through your life, provided you curb your appetite for rich, luxurious food.
  This may at times be difficult on account of the public banquets and dinners you will be expected to attend due to important positions you are likely to fill.
  Your greatest danger will come from high blood-pressure or heart failure brought on by over-work.`,
  
  
       importantNumbers: `Your most important numbers and dates will be the series of "three," "one" and "four" such as the 1st, 3rd, 4th, 10th, 12th, 13th, 19th, 21st, 22nd, 28th, 30th and 31st; but the "three" and "one" series will be the most powerful for you to use, and you should endeavour to carry out your plans and engagements on dates making this series in any month of the year.`,
     colors: `To increase your magnetic vibrations you should wear, at least in some part of your clothing, the colours of: Jupiter: All shades of violet, mauve or violet-purple.
  The Sun: All shades of gold, yellow, orange, etc.
  Uranus: All shades of sapphire-blue, and electric greys.`,
  
  
      jewels: `Your "lucky" jewels are the amethyst, all purple coloured stones, diamonds, amber, topaz and sapphires.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 3rd, 10th, 12th, 19th, 21st, 28th, 30th, 37th, 39th, 46th, 48th, 55th, 57th, 64th and 66th.
  The years making a "four" will also be eventful and important, but as a rule not so favourable.`,
  
  
     magneticAttraction: `[The text specifies the attraction to the numbers 3, 1, and 4 and their dates.]`
     },
  
  
     4: {
     character: `Persons Born on August 4th , 13th , 22nd , 31st Number 4 People in This Month If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus and the Sun in the Sign of Leo the Lion, Second House of the Triplicity of Fire.
  If born on August 31st you would be at the commencement of the next Sign-Virgo, Second House of the Triplicity of Earth, and more influenced by the Sun, Uranus and Mercury (Negative).
  The basic foundation of your character and disposition is described in previous pages for persons born in August.
  In your special case, under the influence of the Uranian vibration the more individual side of your character will stand out with much prominence.
  You will have a very decided love of independence, both in thought and action.
  You will incline towards unconventionality in every form.
  You are likely to be considered more or less eccentric and odd and will not easily fit in with the plans of others.
  Your own people and close relations will be the most difficult to get on with.
  You will resent restraint and criticism and if you are in the position to do so you will break away from home ties and travel extensively.
  You will require to develop great patience, especially in dealing with any intimate relationships.
  If you have the means to strike out for yourself and can do so, you would probably make a distinct success in some unusual kind of work or career.
  You will have unconventional views as regards both religion and life in general, and will be inclined to make many enemies by the extreme frankness of your method of expression.
  If born on any of these mentioned dates in the month of August, you will have many unusual adventures in the course of your life, together with experiences in your affections with many disappointments and sorrows in connection with love matters, particularly in connection with your home and domestic life.
  This part will not be so much in evidence if you were born on August 31st.`,
  
  
       finance: `Finance: In matters of finance you will be difficult to understand.
  You will apparently care little about money, and yet attract it to you for the power it can give.
  In business matters you will either trust implicitly, or be suspicious of the persons you are associated with.
  You would do better working alone.
  You can see both sides to every question and can argue out either side with equal force and conviction.
  You could make a success in financial matters as a banker, and you will be likely sooner or later to strike some new idea in whatever your career may be that will bring you large returns.`,
       health: `Health: You will have a good constitution, but one largely dependent on whether your surroundings are congenial or otherwise.
  Good health or the reverse will be enormously influenced by your state of mind.
  If unhappy you will be inclined to brood, become melancholy and shrink, as it were, too much within yourself.
  Your system will have a tendency for auto-poisoning, obstructions and mysterious ailments difficult to diagnose.
  The bones of the body will be more or less brittle, and you have to be particularly careful against sudden falls and injuries to the feet and legs, some weakness or injury to the spine may also be expected.
  There are two classes of persons that belong more especially to those born under the Uranian numbers and dates in August.
  One type is inclined to put on fat rapidly towards middle life.
  If you belong to this class you should guard yourself against heart disease or coma affecting the brain.
  If on the contrary you belong to the type that begins to lose flesh readily as you approach middle life, you should take precautions against all forms of nerve disease that if not taken in time may threaten paralysis in later years.`,
  
  
       importantNumbers: `Your most important numbers and dates all through your life will be the 4th, 13th, 22nd, 31st; also the 8th, 17th and 26th, especially during the period from June 21st to the end of August and again from the 21st of December to February 19th.`,
  
  
       colors: `The colours that would give you the best vibrations for your success are very similar to those for persons born on the same dates during July, namely all shades of sapphire blue or ultramarine, with combinations of gold, yellow, orange and bronze.`,
  
  
     jewels: `The "lucky" jewels for the 4th, 13th, 22nd and 31st of August are sapphires, diamonds, rubies and topaz.`,
       climactericYears: `The most important or climacteric years for persons born on these dates are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th and 71st.`,
  
  
      magneticAttraction: `You will be strongly attracted to persons born on the above dates and you will find that such persons will play a more or less fatalistic role in relation to your destiny.`
     },
  
  
     5: {
      character: `Persons Born on August 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of Mercury, the Sun and Uranus in the sign of Leo the Lion, Second House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in pages for persons born in August.
  In your special case the more important qualities will be influenced by the planets of Mercury, the Sun and Uranus.
  Mercury in Leo, also called House of the Sun, is a good mental combination.
  It promotes intellectuality and judgment in all matters relating to the mind.
  Its chief danger is that it makes people rather impetuous and hasty in their decisions, also quick tempered and impatient with those who cannot act or think quickly.
  The better qualities it bestows are of a strongly ambitious nature, it is especially beneficial for authors, artists, actors and all those whose work has to appeal to the public.
  The combination of Mercury and the Sun in this period gives assurance, self-confidence and much financial ability, but may incline one at times to take great risks or go in for speculative ventures, but as a rule it is a fortunate combination if kept well under control.
  The Combination of Mercury with Uranus will bring sudden and unexpected change into the life, also in the career or profession, together with restlessness of disposition and much desire for change of place or travel.
  If you were born on one of these dates, the 5th, 14th or 23rd of August, which by natural addition make the single number of "five"—the number of the planet Mercury-you will be sensitive and highly strung with nerves generally at high tension.
  At the same time you possess both will-power and control over yourself when working for any set purpose provided it is not one of long duration.
  You will abhor drawn out tasks or monotony of any kind, and will succeed best at the call of some sudden emergency or when working at "fever heat" over a plan, purpose or ideal that you have close to your heart.
  You will be inclined to be changeable in your love affairs, a new face having always a strong attraction for you.
  You will be very adaptable to persons and circumstances until the novelty wears off.
  You will be fond of dancing and movement and all forms of play that requires agility or quickness.
  You are likely to take an interest in airplanes and swift motor cars; in fact, all inventions that can annihilate distance.
  You will not be an easy person to advise or reason with, as you will be very much inclined to be "a law unto yourself."`,
  
  
       finance: `Finance: You will be exceptionally clever in originating schemes for others.
  You will be so versatile and adaptable that nothing comes amiss to you.
  Your greatest danger lies in forming undesirable acquaintances who may lead you into trouble before you are almost aware of their influence.`,
  
  
      health: `Health: You will be inclined to live too much on your nerves, to exhaust your system by having little moderation in anything you do.
  You will be liable to suffer from neuralgia in various parts of the body, at times to have acute attacks of indigestion and deranged internal organs.
  For such things you will be inclined to fly to the quickest means of relief and may become an addict to drugs or stimulants if you do not keep yourself under absolute control.
  An example of this may be found in the life of that brilliant French author, Guy de Maupassant.`,
  
  
       importantNumbers: `Your most important numbers and dates in any month, but especially during June and September, are the 5th, 14th, 23rd, with as secondary numbers the 1st, 10th, 19th and 28th.
  You should endeavour to use these dates in making appointments, or for trying to carry out your own plans and engagements.
  At the same time I have to state that all persons who come under the "number five" are less influenced than others as far as the law of numbers is concerned.
  Such people are adaptable to all numbers, as well as to people no matter when they may be born.`,
  
  
      colors: `It is the same way with colours.
  You could wear all shades with equal success, but at heart you will be inclined to favour light tones more than any others.`,
  
  
       jewels: `Your "lucky" jewels are diamonds, pearls and bright glittering stones of all descriptions.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 59th and 68th.`,
  
  
       magneticAttraction: `You will find a certain amount of attraction for persons born on the series of "fives" in any month of the year, such as the 5th, 14th, 23rd, but being a "number five" person, you will not be as much influenced by any special series as you will remain adaptable to all.`
     },
     6: {
      character: `Persons Born on August 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology, combined with my system based on Chaldean Numerology, you come under the vibrations of Venus, the Sun and Uranus in the Sign of Leo the Lion, Second House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in the month of August.
  In your special case the more dominant qualities will be influenced by the combination of Venus, the Sun and Uranus.
  Venus in the Zodiacal Sign of Leo the Lion, also called the House of the Sun, will cause the affectionate or love nature to be much in evidence in all matters affecting your life and career.
  If you are born on one of these dates in August, your nature will be more than usually sympathetic and generous to all those you are brought in contact with.
  You will be magnetic to your opposite sex, intense and ardent in your affections, in other words a person who cannot live without love in one form or another.
  It does not, however follow that the sexual or animal passion will be the dominant factor in your life.
  On the contrary this combination with the Sun will give you more an affectionate nature and high ideals regarding home and family life than might be expected from your magnetic nature and the attraction you will naturally possess towards members of your opposite sex.
  You will make friends easily and rapidly in whatever sphere in life "it has pleased God to call you." You will crave much for social life; you will love to entertain your friends, and give them the best of everything that may be in your power to give.
  Out of these desires there is every likelihood that sooner or later will be born a decided talent for the amusement or entertainment of others by the employment of one or more of the Venus qualities, such as music, art, especially dramatic art, the film world, literature, poetry, singing, dancing and such like.
  You will take a keen interest in young people and at the stages of your life you will gather them round you.
  Perhaps for this reason you will yourself never look old or feel old.
  To keep this side of your nature in full activity you will crave for a continual stream of new faces passing in and out of your own "home harbour".
  It is on this phase of your disposition, whether you are a man or a woman that you will find yourself much misjudged and where the "ship wreck" of your life is threatened.
  Having Uranus as one of the Principal planets in the combination under which you were born, you will largely attract odd, unconventional people to you.
  Being by nature generous to the faults of your friends, you will probably see no harm in what outsiders may criticise and so bring down on your own head that calumny that you would if possible avert for others.
  Your combination of planets, is however, such a favourable one, that as a general rule you may expect to be more fortunate than otherwise.
  I must warn you, however, against being too generous to your friends and relations; a tendency to "show" and an extravagant way of living that will be inclined to exhaust your financial reserves.
  But, as a general rule, you will have a lucky and successful life and rise to hold important positions in whatever career you follow.`,
  
  
      finance: `Finance: You will be reasonably sure to make money, have luck through your investments generally, and become wealthy.
  Also by any talents you are likely to develop in connection with music, literary work, dancing, the theatre, or in public life.`,
  
  
       health: `Health: This question will also be very favourable for you.
  You should have a very healthy life.
  You may have, however, some danger from animals, perhaps your fondness for them may be the cause of this.
  Late in your life there is likely to be some trouble from weakness of the heart and a dropsical tendency that will affect the lower limbs.`,
        importantNumbers: `Your most important numbers and dates will be the basic ones of "six," "one" and "four", such as the 1st, 4th, 6th, 10th, 13th, 15th, 19th, 22nd, 24th, 28th, and 31st.
  The latter series containing the basic number of "four", I do not recommend you to select for any plans coming from you, just to watch its effect as it is drawn into your life, but more as a warning than a promise.`,
  
  
      colors: `Your most favourable colours are all shades of blue, from the lightest to the darkest also all shades of gold, yellow, orange and golden brown.`,
  
  
      jewels: `Your "lucky" jewels are the turquoise, all blue stones, diamonds, topaz and amber.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 6th, 10th, 15th, 19th, 24th, 28th, 33rd, 37th, 42nd, 46th, 51st, 55th, 60th, 64th, 69th.`,
  
  
       magneticAttraction: `You will be attracted towards persons born on dates making any of the series of "one", "four", "three", or "six" in any month of the year.`
     },
  
  
     7: {
      character: `Persons Born on August 7th , 16th , 25th Number 7 People in This Month If you were born on any of the above dates in August, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon, Sun and Uranus in the Sign of Leo the Lion, Second House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in August.
  In your special case the more dominant qualities will be influenced by the planets of Neptune, the Moon, Sun and Uranus.
  This is a very peculiar combination which I will endeavour to set out in detail.
  Neptune in Leo will cause you to be extremely ambitious but not in ordinary ways.
  Your ambition may not be to dominate or rule others, but will concern you more with whatever your work may be.
  You will be ambitious for its success more than from a personal standpoint.
  You will have a love of all the fine arts, such as music, painting, poetry, the dramatic arts, the opera, together with occult and philosophical subjects.
  You will be quiet and rather dignified in manner, with high emotional feelings, more or less spiritually inclined but a warm- hearted benevolent nature towards your fellow beings.
  You will have many heartaches and disappointments in matters of the affections without them causing you to become hard or embittered in your feelings.
  The combination of the other planets influencing this period of the Zodiacal in which you were born will add great originality to your thoughts, making you unconventional and independent in your views of the opinions of others.
  You will have very decided attractions and aversions to people, many exciting adventures and peculiar out of the ordinary romances with criticism and trouble.
  You will be more successful in some individual line of work, depending purely on your own personality than in any form of business or commercial life.
  You will have a constant and keen desire for travel and change of place, but you should keep the restless side of your disposition well under control.
  You will be extremely sensitive both in relation to people and your surroundings.
  You will be gifted with intuition and inspiration.
  You would do well in writing on mysticism or any form of occultism, or in painting in fantastic, visionary or mystical lines, or in literary work from your own strongly individual outlook.`,
      finance: `Finance: This will be a difficult point for you to reason out with yourself.
  You will not love money or any routine of business life, yet out of the spirit of self-sacrifice for the welfare of others you will want to make money and will be likely to take up positions distasteful to your disposition.
  This does not mean that you will be unable to earn money, but rather that it will be hard for you to get into anything congenial to your nature.
  If you should have an income independent of your personal efforts, do not seek to increase it by speculation or by following the advice of others.`,
  
  
       health: `Health: The question of health is altogether subject to your mind.
  It will be with you a struggle of spirit over the material.
  From the ordinary way of looking at life you are not likely to be physically very robust, yet you will be able to endure more than persons who look vigorous.
  You will be very peculiar in all matters relating to diet and should be guided by your own instinct in such things.`,
  
  
      importantNumbers: `If you were born on any one of the dates which by natural addition represent a "seven", you will come under the designation of a "Number Seven" person, and you will find this number playing a most important role in the actions of your life.
  Its interchangeable number being a "two", both it and all its series will be nearly equally important as the "seven".
  These numbers and dates are likely to have a more special meaning for you between the 21st of June to August 30th, and between the 25th of December to the end of March.
  You should endeavour to use the dates these numbers give as much as possible in fixing appointments, and, if you can, you should try to live in houses or apartments whose total, or last unit, makes one of these numbers.`,
  
  
      colors: `Your most fortunate colours are pastel shades of green, dove-greys, orange, yellow or gold.
  You can also wear a combination of sapphire blue, but you should avoid very sombre shades and black as much as possible.`,
      jewels: `Your "lucky" jewels in this case cover a wide range, such as the moonstone, diamonds, pearls, jade and amber.`,
  
  
       climactericYears: `The most important or climacteric years of your life are the 2nd, 11th, 20th, 29th, 38th, 47th, 56th, 65th, 74th; 7th, 16th, 25th, 34th, 43rd, 52nd, 61st and 70th.`,
  
  
       magneticAttraction: `You will find a strong magnetic attraction to persons born in the series of the "two" or the "seven", such as those born on the 2nd, 7th, 11th, 16th, 20th, 25th or 29th in any part of the year.`
     },
  
  
     8: {
      character: `Persons Born on August 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates in August, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of Saturn, Uranus and the Sun in the Sign of Leo the Lion, Second House of the Triplicity of Fire.
  The 8, 17 and 26th, producing as they do the single number of "eight", classify you as a "Number Eight" person, while the planet Uranus having such influence with the "Number four," you will find the numbers of "eight" and "four" in all their series will have great significance in the affairs of your life or career.
  The basic foundation of your character and disposition is described in previous pages for persons born in August.
  In your special case the effect of the above numbers will be all the more accentuated by the fact that the part of the Zodiac opposite your month of birth—August—is the House of Saturn (Positive) in the Sign of Capricorn.
  This is a very peculiar combination deserving the greatest consideration on your part if you wish to make the best out of your life.
  It is a combination which will cause your character and life to be full of contradictions, making it very difficult for other persons to understand you, or for you to take advantage of circumstances.
  You will have a generous benevolent nature, but will never get the credit you deserve for your kind actions.
  You will have an exceptionally strong will, but one leaning to obstinacy of purpose in the face of difficulty or opposition.
  You will have very considerable ambition but not one that can easily fit in with the plans of others.
  For this reason it would be best for you to avoid partnerships of all kinds and not be afraid of being a "lone wolf" among your fellows.
  You will follow either of two sides in the realm of thought, one the absolute contradiction of the other.
  You may become either a skeptic or an unbeliever in all matters of religion or the direct opposite, namely more or less fanatical in your fervent devotion to some creed or rule of conduct.
  In whatever you do, you will be intense in all your emotions and desires, in fact too much so for your own happiness or material success.
  Your life is also likely to be a strange contradiction.
  If you are a skeptic or materialist in the early part you will most probably be the extreme opposite in the latter half, and vice-versa.
  In any case, you may expect strange experiences, but those leaning more to the mysterious unexplainable or fatalistic than to anything on the ordinary plane.
  You will have many secret enemies and face at times calumny and scandal; no matter what position you may rise to there will always be the danger of underhand attacks against you.
  For this reason it would be well for you to be well insured against loss, also against accidents of all kinds.
  You are likely to have unusual experiences in both home life and marriage and sadness or trouble in connection with relatives on your own side or that of the family you marry into.
  Your best friends or companions will be more or less out of the ordinary or engaged in uncommon occupations.
  You should be careful of becoming despondent or feeling that you are misunderstood.
  Be content to be "a Daniel"—to stand alone if necessary for your ideals, remembering if you do not get your reward in this life that in the eternity that lies beyond the adjustment of things will come.`,
  
  
       finance: `Finance: You will have to exercise great caution in all money transactions.
  You will not be able to trust others.
  You will be likely to be robbed or defrauded by servants or inferiors.
  To be successful you should keep your business affairs very much to yourself, and in your own hands.
  You are likely to make money by investment in old established concerns, also in dealing with land, houses, mines and minerals.`,
  
  
      health: `Health: For some curious reason there will be great contradictions in your life in regard to health.
  You will either be unusually strong or you will be the reverse.
  If on the strong side, you will have superabundant energy and great "staying" power, but the general rule of the combination under which you were born governing the 8th, 17th or 26th of August is, that some mysterious psychic influences control the lives of such persons.
  If born on any one of these dates the very thoughts of others, if antagonistic to you, could make you ill.
  In such a case you will be inclined to have peculiar sicknesses, not easily cured by ordinary methods.
  Doctors with even the best intentions will be liable to prescribe the wrong treatment.
  You will be likely to suffer from internal pains very difficult to diagnose; you will be easily poisoned by drugs, auto-intoxication and stoppages of the intestines.
  In spite of this you will be likely to recover by equally mysterious means and the chances are that you will in the end live to an advanced age.
  You will be prone to have many accidents, to break or strain the bones in the legs and feet, to have "fallen arches" to have weak ankles and to suffer much with rheumatism or arthritis.`,
       importantNumbers: `As you are a "Number Eight" person, you will find your important dates will fall under "four" and "eight", such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st, and the final digit of all numbers concerning you will follow the same rule.
  I cannot promise these will be "lucky" numbers for they will be more or less fatalistic, but by preparing to meet them you will follow the plan "to be forewarned is to be forearmed."`,
  
  
      colors: `The colours you will feel you have an affinity with will be all dark and sombre shades, especially those of dark purple, black and the deep shades of sapphire blue.`,
  
  
      jewels: `Your "lucky" jewels are black diamonds, dark sapphires, black pearls and all dark stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life will be the 4th, 13th, 22nd, 31st, 40th, 49th, 58th, 67th, 76th and the 8th, 17th, 26th, 35th, 44th, 53rd, 62nd, 71st and 80th.`,
  
  
      magneticAttraction: `You will be much attracted to persons born on the series of "fours" and "eights" in any part of the year, such as the 4th, 8th, 13th, 17th, 22nd, 26th or 31st.`
     },
  
  
     9: {
      character: `Persons Born on August 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of Mars, the Sun and Uranus in the Sign of Leo, Second House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in previous pages for persons born in August.
  In your special case the effect of the above planets and numbers will be very marked all through your career.
  The effect of Mars in this Sign of Leo, the House of the Sun, will give you great force of energy, but is likely to make you very impulsive in all your actions.
  You will be extremely independent in character, will chafe against any form of restraint or being dictated to in any way.
  You will have a keen sense of justice, law and order, and as general rule will take the part of the "under-dog" in all disputes.
  You will be very conscientious and insist on straight dealing from others.
  Of an enterprising spirit you will lean towards taking on too many burdens on your shoulders and unless you practice control and husband your reserve forces you will wear yourself out and not reach the average span of life.
  You will find your best sphere of usefulness in taking over positions of responsibility in business or in the domain of municipal affairs, public offices, politics, government or in connection with military matters.
  You must expect to meet many "ups and downs" in whatever your career may be.
  You are likely at times to fill high positions and in other periods complete cessation of efforts where you will apparently not fit in with the trend of events.
  In all you do, consciously or unconsciously you will be inclined to arouse much enmity and opposition to your plans.
  You will be likely to create bitter enemies whose hostility will be life-long.
  At heart you will be really magnanimous and generous, but unable to show these qualities while the fighting lasts.
  When the opponent is "down and out" you will be quite likely to help him or her back on their feet.
  You may expect to have to cope with many unusual situations, danger to your life from violence, also from fire, explosions and firearms.
  You are prone to meet with accidents causing injury to the head and lower extremities but the greatest likelihood of death will come from syncope or heart failure caused by overwork.
  You will be likely to have many odd love affairs, secret alliances and romantic episodes, but generally with the wrong people and nearly always with some element of danger attached to them.
  You will be fond of all strenuous sports and adventures full of risk and daring.
  You should also have much ability in handling machines and dealing with them and in inventions connected with such things.
  You should cultivate those in high ranks of positions superior to your own.
  Your greatest troubles will come from inferiors and servants.`,
  
  
      finance: `Finance: During your early years you will meet with many difficulties and disappointments in money matters, but from about your 36th year you will be likely to be very successful in business organizations and finance generally.
  You should avoid all forms of speculation in stocks and shares.`,
  
  
      health: `Health: You will have a strong vigorous constitution, but one subject to sudden rise of temperature and an inclination towards fevers; sprain or injury to the back is likely together with a tendency to have many accidents, also injury to the feet and limbs.`,
  
  
       importantNumbers: `The number of Mars—"the nine"— together with the "one" (the Sun) will be the most fortunate numbers for you to act under, such as the 1st, 10th, 19th, 28th and the 9th, 18th, 27th.`,
  
  
      colors: `Your "lucky" colours will be shades of red, rose or crimson, from the lightest to the darkest shades; also gold, yellow, orange to golden browns.`,
  
  
      jewels: `Your "lucky" jewels are rubies, garnets, bloodstones, diamonds and topaz.`,
      climactericYears: `The most important or climacteric years in your life are the 9th, 18th, 27th, 36th, 45th, 54th, 63rd and 72nd.`,
  
  
       magneticAttraction: `You will be much attracted to persons born on the series of the "nine", such as the 9th, 18th or 27th in any part of the year, also to those in the series of the "one" such as the 1st, 10th, 19th or 28th of any month.`
           }
       }
   },
    september: {
     generalInfluence: `The zodiacal influence for the month of September in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Virgo commences on August 21st, but for seven days being overlapped by the "cusp" of the previous Sign, it does not come into full power until on or about August 28th.
  From this date onwards it is in full strength until September 20th and is then for seven days gradually losing force on account of becoming overlapped by the "cusp" of the incoming sign of Libra.
  People born in this period of the year, namely from August 21st to September 20th and in the "cusp" to September 28th, are as a rule successful in life.
  They possess keen intellects with wonderfully retentive memories.
  They are cautious and discriminating about those they associate with and as a rule are not easily imposed upon or deceived.
  They analyze and reason things closely; they make good critics, generally too much so for their own good or happiness.
  They notice things out of place quickly and have excellent taste about their homes.
  They are not as a rule originators, but they carry out with success any plan or work that appeals to them, or things which others have failed to finish.
  But whatever the thing is that occupies their attention they exercise great concentration and will never rest until they have carried out their object.
  They have unusual respect for rank and position; they are zealous supporters of the law and the law's decision.
  They make excellent lawyers and debaters, but they tend towards supporting precedents more than originating any new ordinance.
  They succeed well in scientific research and business, but more from their steady, industrious, persistency, will-power and determination than anything else.
  They are inclined to become wrapped up in themselves and their own ideas and appear to become selfish in the close pursuit of their aims.
  They have always "their wits about them" and are generally self- possessed and self-reliant.
  They are more capable of going to extremes in good and evil than any other type.
  If they develop a love of money they will stick at nothing to acquire it.
  They can adapt themselves to almost any pursuit in life.
  In their inner love nature, they are the most difficult of all to understand, the very best and the very worst of men and women being born in this part of the year.
  In their early years nearly all are intensely virtuous and pure- minded, as might be expected being born in the Sign of Virgo—the virgin.
  If they change, they do so with a vengeance and become the exact reverse, but on account of their inborn respect of the law and their natural cleverness, they succeed in covering up their tendencies better than any other class.
  They have often a tendency to indulge in drugs or drink unless they have got control over themselves.
  In health, as a rule, they are less liable to disease than persons born in any other part of the year, yet the strange thing about them is that they are always imagining themselves to have every illness that they may happen to read about in the public press.
  They are very refined in their tastes as far as food is concerned, and must have things nicely put before them or they will lose their appetites.
  They are extremely sensitive to their surroundings, the least inharmony or annoyance affects their nervous system and upsets their digestive organs.
  They are very liable to sudden internal derangement in the intestines and often have extremes of constipation, varied by dysentery or colic.
  They have a tendency to have trouble with the lungs and to suffer from neuritis in the shoulders and arms.
  As this Sign of the Zodiac appears to be intimately associated with the solar plexus, people born in this part of the year need sunlight and fresh air more than any other class of individual.
  A person born in this period will experience the vital principle of the Sun's rays passing through the Zodiacal Sign of Virgo, endowing them with the characteristics pertaining to the negative side of the planet Mercury.
  Thus, their personal vibrations are strongest on the material plane, and their views of life as a general rule are realistic, analytical, sceptical, shrewd and observant.
  They are not easily imposed upon or deceived.
  Their judgment is usually sound and the discriminative faculty developed to an extraordinary degree.
  They show due appreciation of order, system and discipline, but at the same time do not care to submit themselves to such things, preferring to use their originality and ingenuity than to follow the beaten track.
  They will often champion an unpopular cause rather than go with the crowd.
  Being excellent judges of human nature, they can generally rely upon their first impressions.
  They are, however, somewhat too introspective and unless they keep this tendency well under control they are likely to become hypochondriacs in later life.
  Profound respect for money is found in persons born in this Sign of Virgo— they often set too high a value upon what it represents.
  As literary and art critics they often excel, for their memory is good, they are rapid readers and quick to note any weak point.
  Through their untiring industry, clearness of vision and exceptional accuracy, they generally achieve success, though they may have to work unrecognized in obscurity for many years, but sooner or later, as a rule, they attain prominence.
  Their affectionate nature is very intense but not of the emotional, demonstrative order, but once their love is awakened they are extremely loyal but inclined to be jealous.
  Their views are fixed and positive and when once their mind is made up, not all the preaching the world will move them one iota.
  There is often a tendency to pay too much attention to dress and personal appearance.
  Their will and determination being more or less strong, they are not easily discouraged, and by perseverance are likely to attain their ends.
  The intellect is essentially progressive, but they as a rule pay too much attention to detail.
  They should endeavour to cultivate the appreciative faculties, be more tolerant, patient and more merciful in their criticism if they wish to make their life a well rounded-out success.
  Persons born in the Sign of Virgo are serious and thoughtful; they always desire to acquire knowledge and may often be found in constant attendance at lectures and classes.
  They enjoy listening to good speakers and have themselves a ready command of language.
  A curious thing about persons born in this period of the year is that they always remain young and do not show their age.
  They are irritable and quick tempered over little things, but they hate any form of bloodshed and are good in negotiation and arbitration.`,
  
  
    generalCharacter: `People born in this period of the year, namely from August 21st to September 20th and in the "cusp" to September 28th, are as a rule successful in life.
  They possess keen intellects with wonderfully retentive memories.
  They are cautious and discriminating about those they associate with and as a rule are not easily imposed upon or deceived.
  They analyze and reason things closely; they make good critics, generally too much so for their own good or happiness.
  They notice things out of place quickly and have excellent taste about their homes.
  They are not as a rule originators, but they carry out with success any plan or work that appeals to them, or things which others have failed to finish.
  But whatever the thing is that occupies their attention they exercise great concentration and will never rest until they have carried out their object.
  They have unusual respect for rank and position; they are zealous supporters of the law and the law's decision.
  They make excellent lawyers and debaters, but they tend towards supporting precedents more than originating any new ordinance.
  They succeed well in scientific research and business, but more from their steady, industrious, persistency, will-power and determination than anything else.
  They are inclined to become wrapped up in themselves and their own ideas and appear to become selfish in the close pursuit of their aims.
  They have always "their wits about them" and are generally self- possessed and self-reliant.
  They are more capable of going to extremes in good and evil than any other type.
  If they develop a love of money they will stick at nothing to acquire it.
  They can adapt themselves to almost any pursuit in life.
  In their inner love nature, they are the most difficult of all to understand, the very best and the very worst of men and women being born in this part of the year.
  In their early years nearly all are intensely virtuous and pure- minded, as might be expected being born in the Sign of Virgo—the virgin.
  If they change, they do so with a vengeance and become the exact reverse, but on account of their inborn respect of the law and their natural cleverness, they succeed in covering up their tendencies better than any other class.
  They have often a tendency to indulge in drugs or drink unless they have got control over themselves.`,
  
  
    generalHealth: `HEALTH: Persons born in Virgo are mentally very high strung and worry seems to affect them more than any other class.
  The solar plexus and digestive organs are as a rule delicate and unless care is taken with diet they often suffer from duodenal ulcers.
  Light, plain food, plenty of pure water, fresh air, sun baths and a more than ordinary amount of sleep and rest, generally set these people back on their feet.`,
    generalFinance: `FINANCE: In matters of finance this is a favourable part of the year to be born in.
  It gives good business ability, a careful frugal nature, not one easily imposed on by others.
  It gives favourable conditions for investing in houses, lands and the exploitation of such things.`,
  
  
    generalMarriage: `MARRIAGES, UNIONS, PARTNERSHIPS: People born in Virgo will find their most likely chance of success in marriage, unions or partnerships with those born in their own Sign August 21st to September 20th, Second House of the Earth Triplicity.
  December 21st to January 20th, Third House of the Earth Triplicity, or April 20th to May 20th, First House of the Earth Triplicity, and in the seven days of the "cusp" at the end of each of these periods, also persons born in the part of the year the exact opposite of their own, in this case February to about the middle of March.`,
  
  
    numbers: {
     1: {
     character: `Persons Born on September 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibration of the Sun, Uranus and Mercury in the House of Mercury (Negative), Second House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in previous pages for persons born in September.
  In your special case the effect of these planets and numbers will be more fortunate than otherwise.
  The Sun, in the Sign of Virgo, together with Uranus and Mercury (Negative), will endow you with a very active mind capable of assimilating knowledge easily.
  You will be contemplative, an earnest student of nature and very industrious in whatever work or study you may take up.
  You will have a good command of language, also a love of beauty in every shape or form, but will be likely to have great difficulty in finding your true vocation.
  You will attempt many things and may have to wait until about middle life, or past it, before you get your feet set solidly on the course you will eventually pursue.
  You will have a considerable desire to gain wealth, but in spite of your keen brain you will all through your earlier years have great difficulty in accumulating it.
  Your chief fault will be that you easily get restless, dissatisfied and discontented and allow yourself to worry too much.
  You should endeavour to develop concentration of mind, gain belief in yourself and your purpose and not allow any delay or discouragement to prevent the carrying out of your plans.
  If you work along these lines with the exceptional brain power indicated by your sign of birth, you will in the long run be bound to meet with more success than falls to the lot of most people.`,
  
  
      finance: `FINANCE: As a rule you will come under very favourable conditions for making money.
  You will easily inspire confidence from others and be pushed by them into positions of trust and responsibility.
  If making money on your own account, you will be fortunate in investments and in creating industries or business.`,
  
  
      health: `HEALTH: If born on the 1st, 10th, 19th or 28th of September, you may expect good health and vitality, but to keep perfectly well you should have as much fresh air and exercise as possible.
  You are not intended by nature to live in cramped surroundings or to have an indoor existence.`,
  
  
      importantNumbers: `As you are a "Number One" person your important dates will be the 1st, 10th, 19th and 28th; while the "five" and its series will also play an important role.`,
  
  
      colors: `Your "lucky" colours are all light shades, especially those of pale yellow, gold, orange and light sapphire blue.`,
      jewels: `Your "lucky" jewels are the diamond, topaz and sapphire.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 1st, 10th, 19th, 28th, 37th, 46th, 55th, 64th and 73rd.`,
  
  
       magneticAttraction: `You will find yourself much attracted to persons born in the series 1, 2, 4 and 7, such as the 1st, 2nd, 4th, 7th, 10th, 11th, 13th, 16th, 19th, 20th, 22nd, 25th, 28th, 29th and 31st in any month of the year.`
     },
  
  
     2: {
     character: `Persons Born on September 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates in the month of September you come under the heading of a "Number Two" person, as all these dates by what is called natural addition represent the "number two".
  If you were born on one of these dates, following the rules of Zodiacal Astrology, combined with my system based on Chaldean Numerology, you come under the vibrations of the Moon, Neptune and Mercury in the Zodiacal Sign of Virgo, Second House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in previous pages for persons born in September.
  In your special case the effect of your planets and numbers will be as follows: You will have a very fertile imagination and excellent mental ability but inclined to be too fond of change to make the most of your abilities.
  You will have a keen desire for all intellectual studies, and will be more inclined to follow such things than any form of commercial or business life.
  You will not be ostentatious or pretentious; rather fond of a quiet life without show, very trustworthy and conscientious in whatever work you may be engaged in but rather lacking in "push" due to your not having enough of self-confidence or belief in your own abilities.
  This weakness you could easily overcome if you would make the effort to do so.
  You would do well as a research student, or in literature or artistic work, also as a chemist or in science of any kind.
  You will be fond of flowers, gardening and those things that are closely concerned with nature and the products of the earth, but hardly commercial enough to bring them to a financial success.
  You will be quiet and reserved, undemonstrative but capable of making and holding your friends, particularly those of your opposite sex.
  You are liable to have many changes of place and journeys and will be likely to travel a great deal.
  You should be especially careful in your selection of partner in marriage and not do anything hasty in regard to it as the influences respecting it are not so favourable unless great care is taken.
  It would be better for you if you married late in life as your own nature will be inclined to radically change your ideas and views, about or after middle life.
  At times you will be inclined to suffer from attacks of depression and melancholia.
  If you study such things you will find how much the Moon affects you.
  You will be more at your best from the period of the crescent to that of full Moon and up to its last quarter.
  During this period you should put out your best effort to carry out your plans and ideas and relax or take things more quietly during what is called "the dark of the Moon." You should fight against becoming melancholy or depressed owing to the bad effect it will have on your digestive organs and general health.
  You will have a very receptive brain, learning things easily and retaining what you have mastered.
  You will be quite likely to develop clairvoyant and psychometric talents, but if you do you will keep such matters very much to yourself.
  You will be rather reserved and undemonstrative in affection, but extremely loyal and faithful to those you love.`,
  
  
      finance: `FINANCE: You will be more inclined to earn money as the result of brain work than to go into the larger business field, but should the desire for wealth appeal to you, you would do well as the head of big enterprises.
  You would do well in literary work, especially, as a critic, book reviewer or proof reader; also as a teacher, secretary or traveller for novelties off the beaten track.
  You will be frugal and careful over money, rather, overanxious about your future but you are likely to always have enough for your wants.`,
  
  
      health: `HEALTH: In health you will be liable to have many "setbacks" to fight against such as disorder with the digestive organs, stomach and intestines.
  You could avoid such things by making a study of diet and selecting foods that experience teaches you suit your system better than others.
  You will be extremely sensitive to food not properly cooked and will be subject to such things as ptomaine poisoning unless you exercise great care in what you eat.`,
  
  
       importantNumbers: `Your most important numbers and dates will be the series of "twos" and "sevens", such as the 2nd, 11th, 20th, 29th and next in importance the 7th, 16th and 25th.`,
  
  
      colors: `Your "lucky" colours are all pastel shades of greens, greys and blues.
  You should never wear heavy, dark sombre colours if you can avoid doing so.`,
  
  
      jewels: `Your "lucky" jewels are all kinds of jade, moonstones and pearls, but green jade would be the best for you.`,
      climactericYears: `The most important or climacteric years in your life are the 2nd, 11th, 20th, 29th, 38th, 47th, 56th, 65th and 74th.`,
  
  
       magneticAttraction: `You will be inclined to be attracted to persons born in the "two hyphen seven" (2-7) series in any month of the year, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.`
     },
  
  
     3: {
     character: `Persons Born on September 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates in the month of September you come under the heading of a "Number Three" person, as any one of these dates by natural addition represent the "number three".
  If born on any one of these dates, following the rules of Zodiacal Astrology combined with my system of Chaldean Numerology, you are influenced by the planets Jupiter and Mercury in the Sign of Virgo, Second House of the Triplicity of Earth whose ruler is Mercury in its (Negative) aspect.
  The basic foundation of your character and disposition is described in previous pages for persons born in September.
  In your special case the effect of your planets and numbers will be as follows: At heart you will be intensely ambitious, of an aspiring nature determined to rise above the conditions and circumstances of your birth and early surroundings.
  You will not be easily satisfied no matter what position you may reach.
  You will drive yourself with a "whip of iron" and unless you curb the insatiable desire for successes and overwhelming work you will be likely to meet at times a very serious breakdown of the nervous system.
  It will come quite natural to you to dominate those around you.
  You will have a strong will, firm determination to carry out your plans, but at the same time you will hold yourself well under the leash using considerable caution to prevent going too far against the opposition of others.
  You will be inclined to be materialistic in your desire to accumulate wealth, and yet with it all you will be generous and magnanimous to others provided you are allowed your own way in being generous.
  You will be discreet and prudent in all your dealings, rather suspicious of persons in general.
  Your mind will be of the practical type, quick to analyze any matter put before you.
  Scientific investigation and research will appeal to you but will be used by you as one would employ a servant to serve your aims and carry out your purpose.
  If you become wealthy you will employ your riches to endow universities or assist students in their researches.
  You will find your best field work in positions of responsibility, authority and trust.
  You will be good in organization, making laws for others to follow, but for your own personal life you will be "a law unto yourself" very probably not seeing anything wrong or out-of-the-way in carrying out your own plans.
  You will be highly intellectual, mentally absorbing with ease the most difficult problems that may confront you at various phases of your career.
  You will be extremely critical and careful in your choice of friends and acquaintances, allowing few to get really intimate with you at any time.
  Marriage is likely to be a curious experience, very probably contracted with either an inferior in station, or with some person you will mentally dominate.
  You should gain by investments in land or house property or as a pioneer in the development of countries, also in association trading in foreign countries or places far from your point of birth.
  You would also be likely to meet with success in public life or some career that would bring you before the public.
  The entire trend of your life will be successful, the only danger will be of "over-reaching yourself" or staking all on some over- ambitious "coup", but provided you keep yourself well in hand you should expect to rise far above your fellows.`,
  
  
      finance: `FINANCE: In matters of finance there is nothing much for you to fear, although you will always be inclined to be overanxious.
  You will not be confined to any one life of work, but will more likely have many "irons in the fire".
  You will have a great amount of foresight and judgment and will always try to be "one step ahead" of your rival in whatever career you may be in.`,
  
  
      health: `HEALTH: Your principal tendency as regards health will be to suffer from the upper stomach, the liver, spleen and digestive organs, and tendency for diabetes.
  You are likely to neglect yourself in your anxiety to succeed.
  You will be very much inclined to treat yourself as you would a machine and only send for a doctor as you would a mechanic to make the needed repairs.`,
  
  
       importantNumbers: `Your most important numbers and dates will be the series of "threes", "fives" and "sixes".
  You should endeavour to carry out your plans on the following dates the 3rd, 5th, 6th, 12th, 14th, 15th, 21st, 23rd, 24th and 30th.
  If born on September 30th you will be at the commencement of the incoming Sign of Libra.
  You will have the same qualities of the other Number Three dates in September, but if anything more fortunate.`,
  
  
     colors: `Your fortunate colours are all light shades, with a combination of mauve, violet, orchid or violet-purple.`,
      jewels: `Your "lucky" jewels are diamonds, all glistening stones and amethysts.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 3rd, 12th, 21st, 30th, 48th, 57th, 66th and 75th.`,
  
  
      magneticAttraction: `You will be likely to be much attracted to persons born on dates making the series of "three, five or six" in any month of the year.`
     },
  
  
     4: {
     character: `Persons Born on September 4th , 13th , 22nd Number 4 People in This Month If you were born on any of the above dates you come under the heading of "Number Four" person, as all these dates by natural addition represent the number four.
  If born on one of these dates, following the rules of Zodiacal Astrology combined with my system based on Chaldean Numerology, you come under the vibrations of the planets Uranus, the Sun and Mercury in the Zodiacal Sign of Virgo, Second House of the Earth Triplicity whose ruler is Mercury in its (Negative) House.
  The basic foundation of your character and disposition is described in previous pages for persons born in September.
  In your special case the effect of your planets and numbers will be as follows: The influence of Uranus in this combination has a very interesting significance.
  It will cause you to be so original and independent in your thoughts and actions that the majority of persons you meet are likely to consider you odd, peculiar and perhaps eccentric.
  If your conditions of life are such that you are forced to blend and mix with your fellows you will find things as a rule very difficult and troublesome.
  You will not be a person to make friends easily and those you do make are not likely to be of much assistance to you or your plans.
  You will see life from such a different angle to most people, that you will find yourself at variance with the views of others and especially with members of your own family.
  Your will and determination will be exceptionally strong, rather inclining you to be obstinate unless your reasoning powers are appealed to.
  From a worldly standpoint you may not be considered as successful as others from a financial standpoint, as you will often act against your own interests and not care enough for the material or financial outcome of any issue that may crop up.
  You will be inclined to make many enemies, because your motives are not understood.
  You will have curious experiences of persons who will plot and plan for your downfall and who at times may cause you very great trouble.
  You will be particularly prone to have lying stories circulated about you, anonymous letters, scandal and calumny are likely to crop up again and again from hidden quarters.
  It would be well for you to avoid law and litigation as much as possible as you would find it difficult to get justice done to yourself personally, or to any cause you would defend.
  For some occult reason difficult of explanation you will find other people causing one "muddle" after the other in your affairs, and great delays in your efforts to get things straightened out.
  This being so, you will be more fortunate if you act as much as possible on your own initiative and trust to your own judgment and intuition.
  You should not decide any question in the heat of discussion for the simple reason that your nature will prompt you to see the opposite side of any argument so that such things will only complicate the issue and as a rule will turn people against yourself.
  If you should happen to be in an independent position, not having to be subject to other people's views, you would then be able to carry out your unconventional ideas and make a success from your very originality; but in any case you are likely to find yourself the target from criticism and be hurt by it unless you are strong enough not to care what other people think.
  It is the "unexpected" that will always happen to you and for you.
  With such a combination, happiness in partnership, unions or marriage is very doubtful.
  Success in marriage will solely depend on your having the luck to meet some person of your opposite sex who can make your ideas and plans their own.
  You will care for intellectual things above all others.
  You will pursue "new ideas" and have the possibility of achieving success in those things appertaining to "advance thought" in metaphysics, science, chemistry, electricity, television or radio work, in fact anything out of the "beaten track".`,
  
  
      finance: `FINANCE: In questions of finance you will be liable to have money taken away from you by flaws in wills or through litigation.
  You will have to depend largely on your own efforts to make money, which you could do by constructive work in the following out of things more or less of "the beaten track", but you will always be more successful when working alone.
  You will be liable to meet with treachery from employees, servants and inferiors.`,
  
  
      health: `HEALTH: In matters of health you will be an enigma to medical men; you will have sudden and uncommon illnesses mostly of an obscure nature.
  You will recover as rapidly as you have fallen ill.
  You could cure yourself through your mind more than any other class of individual.
  All these indications hold good for persons born on September 4th and 13th, but not quite so strongly for those born on the 22nd of September, while those born on the 31st, being beyond what is called the "cusp" of Virgo will take more after the indications given to the incoming Zodiacal Sign of Libra the Balance, which will allow such persons to blend more easily with others and find success attending more readily on their efforts.`,
  
  
       importantNumbers: `Persons born on the 4th, 13th, 22nd and 31st of September will sooner or later notice how important the series of "fours" and "eights" will be in their lives; also dates that produce these numbers in all months of the year, such as the 4th, 13th, 22nd, 31st and the 8th, 17th and 26th.
  I do not call these "lucky numbers," for as a rule they are associated with events that bring serious consequences or are fatalistic in their importance.`,
  
  
      colors: `The best colours to use for those born on the 4th, 13th, 22nd and 31st of September, are all shades of sapphire-blue, also gold, yellow and bronze to golden brown.`,
  
  
       jewels: `The best jewels are the sapphire, topaz, diamonds and glittering stones.`,
  
  
       climactericYears: `The most important or climacteric years of the life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th and 71st.`,
  
  
       magneticAttraction: `You will be inclined to be much attracted to persons born on the series of "four" and "eight" in any month of the year.`
     },
  
  
     5: {
     character: `Persons Born on September 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates in the month of September you come under the heading of a "Number Five" person which the above numbers by addition represent and which has more than the ordinary importance in this period of the year, for the reason that from August 21st to September 20-27 the Zodiacal Sign of Virgo is called the House of Mercury (Negative), and the planetary number given to Mercury is the "five" in all its series.
  Therefore, if born on one of the above dates such as the 5th, 14th or 23rd of September, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology you come under the vibrations of Mercury in the House of Mercury and will be more influenced by the "number five" and its series than any other.
  This number has, however, the very peculiar qualities of adapting itself in a sense, to every other number, just as the persons it represents are apparently able to adapt themselves to the widely different type of persons they come into contact with.
  "Number Five persons", and more especially those born on a date making a "five" between the 21st of August to September 23rd, are less fatalistically influenced by numbers than any other class.
  They have more freedom of action, as it were, and perhaps for this very reason they are not so restricted to any special walk in life but may be found in all.
  If you are a "Number Five" person, especially if born in the Mercury period of the year I have previously mentioned, you will be able to fit yourself into almost any profession or career and make a success of anything that requires brains and mental ability.
  Your greatest fault is however, that you may be too versatile, have too many "irons in the fire" and make too many changes in the course of your life.
  You will detest any monotonous kind of work and will appear to most advantage in any class of occupation by which you can make money quickly without drudgery or plodding.
  For this reason perhaps, "Number Five" persons are often very successful in following their "hunches" provided they do not let themselves be influenced by others.
  That they can be easily influenced by others, especially if born in September, is however more or less a certainty, being born in the Mercury-negative period they are not as self-willed as "Number Five persons" born between the 21st of May and June 20th-27th, the Zodiacal Sign of Gemini and the House of Mercury (Positive).
  In fact if anything "Number Five" persons born in the Mercury- negative period are not positive enough.
  They often lose their best opportunities by being swayed by the advice or opinions of others, or switch off from one career to another by some whim or fancy of the moment.
  If, therefore, you are born on any of these dates in the period indicated you should endeavour to make yourself more firm and positive in all your actions and develop continuity of effort in whatever you may do.
  With your adaptable nature you will make friends almost too easily wherever you go, you will just as readily suit yourself to conditions in countries foreign to your own, you will love to pick up languages rather than to study them, you will be ready to move at any moment, you will have many homes, but be rather inclined to build houses for others but not live in them yourself, at least not for any length of time.
  You will have much tact and diplomacy in handling people; you will be a genial companion, a clever entertaining host and a social favourite wherever you may go.
  But now for the other side of the picture—these very qualities of your character if you are not careful can become your own undoing.
  That genial nature can easily be imposed upon.
  That clever brain with its versatility and desire to make money quickly, can fall a victim to financial sharks with their "gold mines" and Eldorados of the imagination.
  Lastly, those other qualities estimable as they are, in your making friends easily and your adaptability to others, may lead you into all kinds of dangers some of which are likely to be an inordinate craving for change and excitement.
  None of these things need happen to you if you keep yourself well under the reins of self-control and develop ambition and continuity of purpose.
  As you have very considerable inventive talent, mental ability and individuality, you would do well in a literary or journalistic career, the only drawback against this being your lack of continuity of effort and dislike to any form of restraint or monotonous work.
  Marriage is indicated as not being very fortunate and there is a decided likelihood that there will be more than one.`,
  
  
      finance: `FINANCE: Persons born on the 5th, 14th or 23rd of September are so versatile that it would be almost impossible to pick out any one career in which they would be best in making money.
  They can fit themselves in any position and make money in almost anything.
  They are bound at times to have "strokes of good luck" but as a rule they cannot put money aside for their advanced years.
  I would advise that when they have a run of good fortune to buy an annuity so as to protect themselves against their own lack of provision for the future.`,
  
  
      health: `HEALTH: As a rule persons born on the 5th, 14th or 23rd of September belong to a wiry class of humanity, but one that "lives too much on its nerves." They are generally at high tension all the time and in consequence are subject to nervous "break-downs." They often have a twitching in some part of the face, a slight stammering in speech, trouble with the nerves of the tongue and a tendency in advanced years towards paralysis or cramps of the lower limbs.
  As a rule they will be "light sleepers" or suffer from insomnia and not get enough of rest and sleep.`,
  
  
       importantNumbers: `If you were born on any of the above dates you should endeavour to carry out your plans or make your engagements on dates making your own number of "five", such as the 5th, 14th or 23rd of any month.
  Numbers and dates will, however, not be of such governing importance to you as they are for others.
  At the same time I have to state that all persons who come under the "number five" are less influenced than others as far as the law of numbers is concerned.
  Such people are adaptable to all numbers, as well as to people no matter when they may be born.`,
  
  
       colors: `You will not be restricted to any one set of colours, but as a general rule all light shades will be better for you than others.`,
  
  
       jewels: `Your "lucky" jewels are especially diamonds and next to them all glittering stones.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 68th and 77th.`,
      magneticAttraction: `You are likely to be attracted to persons born on the series of the "five" in any month of the year, especially those born in your own month, also in June and February.`
     },
  
  
     6: {
     character: `Persons Born on September 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates in the month of September, you come under the heading of a "Number Six" person as any of these dates by natural addition represents a "Number Six." Following the rules of Zodiacal Astrology, combined with my system based on Chaldean Numerology you come under the vibrations of Venus in the Zodiacal Sign of Virgo, Second House of the Triplicity of Earth, House of the planet Mercury in its negative aspect.
  The basic foundation of your character and disposition is described in previous pages for persons born in September.
  In your special case the effect of the planets combined with numbers will be as follows: You will represent the qualities ascribed to Venus in a very considerable way.
  You will have a most sympathetic nature—one where love and romance will play a very important part.
  You are, however, likely to have many difficulties in connection with your affections, nearly always two "love affairs" at the same time.
  In your early years you will be inclined to be attracted to the "wrong person"—someone already married or inferior to your own position.
  Later in life you will be likely to reverse all this and marry well.
  You will be inclined to develop early and have an "old head on young shoulders." There will be two courses opening before you at the very beginning.
  One will be a very strict, pure kind of life with a devotional or deeply religious trend much influenced by your family and your bringing up.
  The other a desire for freedom from your home, love of adventure and an active life.
  You will follow one or the other, according to the circumstances ruling your early years and the love interests that come into your life.
  You will be fond of outdoor life, good at all kinds of sports and games and very devoted to dogs, horses and animals generally, and you might be very successful at farming or in some large agricultural development, or in the opening up of countries.
  There is as well another side of your nature that may call on you with equal force.
  Being born under the combination of Venus and Mercury, you may go in for some artistic career such as music, art or the theatre; in any of these lines of work you will be likely to meet with considerable success.
  In any case you will be likely to rise to some high position in whatever your career may be.`,
  
  
      finance: `FINANCE: This will be a rather fortunate question for you.
  You will receive help and assistance from your people or from friends in any moment of difficulty.
  You will have gains by legacies and by gifts and from your own side you will be likely to make good investments, especially in connection with houses, land and property in general.`,
  
  
      health: `HEALTH: This question should not trouble you much, as you will have a good constitution, but one you will be likely to undermine by your love of good living.
  As far as illness is concerned you will be liable to suffer from the throat, bronchial tubes and lungs; receive wounds or injuries to the breasts, shoulders, arms and feet.`,
  
  
       importantNumbers: `Your most important numbers and dates will be the series of "fives" and "sixes", such as the 5th, 6th, 14th, 15th, 23rd and 24th, and you should try and make your plans and engagements fall on these dates as much as possible.`,
  
  
       colors: `Your "lucky" colours are all shades of blue, from the lightest to the darkest, also whites, creams and glistening materials.`,
       jewels: `Your best jewels are the turquoise and all blue stones, also diamonds, white pearls and all light glittering stones.`,
  
  
       climactericYears: `The most important years of your life are the 5th, 6th, 14th, 15th, 23rd, 24th, 32nd, 33rd, 41st, 42nd, 50th, 51st, 59th and 60th years.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of "five" and "six" in any part of the year, such as the 5th, 6th, 14th, 15th, 23rd and 24th.`
     },
  
  
     7: {
     character: `Persons Born on September 7th , 16th , 25th Number 7 People in This Month If you were born on any of the above dates in September, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon and Mercury in the Sign of Virgo, Second House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in preceding pages for persons born in September.
  As this period of the year is the negative House of Mercury, there will be many points in your disposition similar and in common with persons born on the same dates in June, the positive House of this planet, and you would get on well with all such individuals.
  You will not, however, be as positive in your views or in your general characteristics as those born in June.
  You will be endowed with the same class of ideality, refinement of thought and imaginative faculties, but in many ways more materialistic.
  You will also be much attracted to mysticism and occult studies, but more critical and sceptical.
  You will want to reason things out, but if once your reason is satisfied, you will be extremely earnest in your convictions, but will not be inclined to force your views on other people.
  In following any of these subjects you will devote a good deal of time to research work and will be likely to examine many creeds and dogmas before finally establishing your own.
  You would also do well in association with any form of "mental science" and such like subjects, also as a writer, musician, chemist or organizer of industries.
  From a material standpoint, things are not likely to go easily for you during the earlier years of your life, but the latter part will promise the accumulation of money, good position and success in whatever your career may be.
  You will attract older people to you and your best friends will be those more or less odd and eccentric, or strongly individual in their work and ideas.`,
  
  
      finance: `FINANCE: In all matters of finance you will be inclined to be over-anxious.
  You will be a good manager for other people's affairs and may even make money for them, but in matters concerning yourself, you may be rather too cautious to take full advantage of the opportunities that come your way.`,
  
  
      health: `HEALTH: Like those born on the same dates in June, your health will be greatly affected by your mind-you will be easily upset by worry and "nerves", and the digestive organs are likely to give you a considerable amount of trouble.`,
  
  
       importantNumbers: `Your most important dates will be the series of "sevens" next to this the "twos", such as the 7th, 16th, 25th and the 2nd, 11th, 20th and 29th of any month.
  You should endeavour to make your plans or engagements to fall on these dates as much as possible.`,
      colors: `In order to increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your apparel, the colours of your principal planets, which are: Neptune: All shades of dove-grey and pastel colours.
  Moon: All shades of pale green, creams or white.`,
  
  
      jewels: `Your "lucky" jewels are green jade, pearls, moonstones and glistening stones.`,
  
  
       climactericYears: `Your most important or climacteric years are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
      magneticAttraction: `You are likely to be attracted to people born on the series of the "two" and "seven" in any month of the year, but more especially persons born on these dates in your own month, also in June or February.`
     },
  
  
     8: {
     character: `Persons Born on September 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the classification of a "Number Eight" person.
  If you were born on one of the above dates you come under the vibrations of Saturn with Mercury (Negative), in the Zodiacal Sign of Virgo, Second House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in preceding pages for persons born in September.
  As this period of the year is the negative House of Mercury, there will be many points in your disposition similar and in common with persons born on the same dates in June, the positive House of Mercury, and you would get on well with such individuals, the difference being that in your case you will not be as positive or as aggressive in your views.
  You will have many restricting influences in your early years, up to about the age of 35, but from that out you will be able to become independent of adverse surroundings and carry out your ambitions.
  You will have a serious turn of mind, inclined to a study of unusual subjects and rather inclined to "keep in your own shell." You will have a tendency to be over-critical and sceptical of people in general.
  You will be persevering and extremely conscientious in whatever you do, but you are not likely to get the credit you deserve for the amount of study or mental work you will give to whatever you may be engaged in doing.
  You will love old books, libraries and museums and will be inclined to write or compile works on such subjects.
  If, however, you are born on the 26th of September you will be so far advanced in the "cusp" of the incoming Sign of Libra that, although you may still come out more into the material world and make your general activities more manifest.`,
  
  
      finance: `FINANCE: In any way you will be disposed to be overcautious and so miss good chances for making money.
  You will often reproach yourself for not having done something you had in mind to do and let the opportunities go past until too late to act.
  You may, however, make good investments in some solid kind of business or in such things as coal mines, land, and house property.`,
  
  
      health: `HEALTH: You will not be inclined to be physically very strong but capable of great endurance in all forms of mental work.
  You will be liable to illnesses brought on by too much sedentary work such as auto-poisoning, stoppage of the intestines, hemorrhoids, hernia and irritation of the skin.
  You should force yourself to take as much outdoor exercise as possible.
  If born on the 8th, 17th or 26th of September you will be liable to meet with many accidents and run a danger of violent death.`,
  
  
       importantNumbers: `You will find the numbers of "fours" and "eights" and also dates making these numbers coming in very much into your life and career, such as the dates of the 4th, 8th, 13th, 22nd, 26th and 31st.`,
  
  
      colors: `To increase your magnetic vibrations you should avoid using heavy dark colours and employ all light shades instead.`,
  
  
      jewels: `Your "lucky" jewels are black pearls, black diamonds, dark sapphires and all dark stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th and 62nd.`,
  
  
       magneticAttraction: `You will be much attracted to persons born in the series of the "four" and "eight", such as those born on the 4th, 8th, 13th, 17th, 22nd, 26th and 31st of any month of the year.`
     },
  
  
     9: {
     character: `Persons Born on September 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars and Mercury for the 9th and 18th (the 27th of September will be explained later).
  If born on the 9th or 18th, you will be in the sign of Virgo, whose Ruler is Mercury in its negative aspect, Second House of the Triplicity of Earth.
  The characteristics for the 9th and 18th of September are very similar to those for persons born on the same dates in June, where Mercury is in its positive aspect, the difference being that the September period will cause you to be more diplomatic in your views or in the carrying out of your plans.
  The planets of Mars and Mercury are friendly to one another, if I may express it in such words, as Mars lends to Mercury much of its fire, energy and determination.
  This combination will make you very active mentally, with a considerable love of risk and adventure.
  Like those born on the 9th and 18th of June, you will be liable to make enemies by your frankness and "hitting straight from the shoulder".
  You will be rather satirical at times, very observant, critical and easily annoyed over small matters.
  You will be well adapted for constructive work, in enterprises, or in engineering or building up industrial factories.
  You will be inclined to make much use of machinery in all your enterprises, but to employ machines to do your work rather than from the inventor's point of view.
  You would also have considerable ability in surgery, also as a dentist and in the employment of fine tools.
  You will be deeply interested in all new scientific discoveries, and would have success in expressing yourself as a philosophical thinker or writer.
  From another side of your disposition you are likely to be disposed to pioneer work in connection with the development of land for agricultural purposes and in the employment of machinery in opposition to older methods.
  Similar to those born on the same dates in June you will be liable to meet with more than the usual amount of accidents, in general in connection with machines of all kinds and there is also likely to be danger from animals, also from airplanes and travel by air.
  If you were born on September 27th, liability to accidents will be more serious, also danger from fires and firearms.
  As a general rule persons born on the 9th, 18th and 27th of September will be successful in whatever they undertake.`,
      finance: `FINANCE: Persons born on the 9th, 18th and 27th of September generally succeed in making money and often become very wealthy by their original ideas in whatever career they follow.`,
  
  
      health: `HEALTH: Similar to those born on the same dates in June, persons born on the 9th, 18th and 27th of September will be more liable to suffer through injuries causes by accidents than from ill-health or disease.
  Those born on September 27th are likely to have many experiences under the surgeon's knife.`,
  
  
       importantNumbers: `Your most important numbers and dates are influenced by the vibrations of the nines and fives, such as the dates that come under the 9th, 18th, 27th and 5th, 14th and 23rd in any month, and if possible you should make your important plans and engagements on these dates.
  Persons born on the 27th of September will find the 'sixes" and "nines" the most important, such as the 6th, 15th, 24th, 9th, 18th and 27th.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours of red, crimson and rose, with a foundation of all light colours.`,
  
  
      jewels: `Your "lucky" jewels are rubies, garnets, red or rose coloured stones of all kinds, also diamonds and bloodstones.`,
  
  
       climactericYears: `The most important or climacteric years of your life are the 9th, 18th, 27th, 36th, 45th, 54th, 63rd, 72nd and 81st.`,
  
  
      magneticAttraction: `You are likely to be attracted to persons born on the series of "three, six and nine", such as those born on the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th and 30th in any month of the year.`
           }
       }
   },
    october: {
    generalInfluence: `The zodiacal influence for the month of October in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Libra commences on September 21st, but for seven days being overlapped by the "cusp" of the previous Sign, it does not come into its full power until on or about September 28th.
  From this date onwards it is in full strength until October 20th, and is then for seven days gradually losing its force on account of becoming overlapped by the incoming Sign of Scorpio.
  This Sign of Libra is represented in symbolism as "the Balance." People born in this part of the year, namely from September 21st to October 20th, and in the "cusp" to October 27th, exhibit a wide variety of character, but they are distinctly "mental" in all they undertake.`,
  
  
    generalCharacter: `They are so strongly endowed with the desire to reason, that they very often stand in their own light.
  If, however, they have once made up their minds to pursue a definite course of action, they will carry it through at any cost.
  They weigh and balance in their minds any argument presented to them.
  They have either a great command of language or they express what they want in short, forcible sentences, but in either case language means to them a great deal.
  Persons born in this part of the year are very often found in public life, but they generally go in for it from the standpoint of their desire to adjust the balance of things for the betterment of their fellows.
  Under ordinary circumstances many of them appear to drift naturally into the study of law, they have a wonderful sense of logic and reason, they are much inclined to frame and make laws or write on such subjects.
  Many born in this Sign of Libra spend a life-time in study or research work of some particular kind; some make excellent scientists and doctors who pursue a special line of study, but whatever they do they generally do thoroughly.
  Persons born in this part of the year are unusually sensitive to their surroundings.
  If these are inharmonious they easily become melancholy, suffer from nervous depression and shrink into themselves.
  They are as a rule very even-tempered; they are born "peacemakers" for they detest "scenes", disputes and quarrels.
  They are neat and tidy and dislike seeing things in disorder.
  They are particular about their appearance and dress but not showy in matters of clothes.
  Persons born in this period of the year have the Solar Orb posited in the Zodiacal Sign of Libra, ruled by Venus in its negative aspect with Saturn in its "exaltation" and the Sun in its "fall".
  The particular position of the Sun in this Sign is responsible for their intricate and varied nature, their predominant sense of equanimity and the blending in their temperament of the sanguine and the melancholy.
  They have a many-sided nature having numerous moods, to which they give great variety of expression.
  Lofty idealism and high moral principle form the fundamental basis of their character.
  Positive and decisive in thought and action, they are endowed with a strong desire to keep down their wonderful natural intuition by critical reason, and accept little or nothing without definite proof.
  In love and affection persons in this period of the Zodiac are not very demonstrative, rather too analytical, rather inclined to weighing motives forgetting that the wings of love were not made for the lens of the microscope.
  Thus they often suffer disillusion and disappointment.
  As a rule these Libra people enjoy great popularity, and make hosts of friends, and at the same time live very much in themselves.
  They have little or no regard for the value of money and rarely involve their affairs through rash speculation and reckless enterprise.
  They love good surroundings and are much affected by their environment.
  They are highly susceptible to the psychological influence of those about them and often take on their mental and physical conditions.
  The artistic side of the nature is very pronounced; they are extremely fond of music and art and often have much ability in that direction.
  Studious, investigative and fond of research, they also attain prominence in the education world.
  Because they live habitually in the present, they will care little for the ties of the past and less still for the obscurities of the future.
  Persons born in this period of the Zodiac on account of the aspects of Venus and Saturn generally sacrifice themselves to others through ties of affection or by their sense of duty.
  In the ordinary run of life they usually have a parent or relative to care for and look after, or if not they marry early and are likely to have an invalid husband or children to hold them back from carrying out their own ambitions.`,
  
  
    generalFinance: `Finance: In the question of finance, although many remarkable and forceful characters are found born in this Sign of Libra, if they succeed in making money they are seldom able to hold on to it in their advanced years.
  Examples of this may be found in such lives as Sarah Bernhardt born on the 22nd of October, who made large sums of money by her great talents as an actress, and yet suffered extreme poverty before her death.
  Another example might be taken from the career of Oscar Wilde born October 16th, at one time the highest paid playwright in the world, but who during the last years of his life had barely enough to exist on and who had to be buried by the charity of a few remaining friends.
  Dr.
  Annie Besant, the head of the Theosophical Society, born October 1st, is another instance of a Libra person gaining high position but not wealth.
  It is not that persons born in this Sign of Libra cannot make money but their fault is that they seldom can keep it or make provision for their future.`,
    generalHealth: `Health: The sign of Libra bearing on this question in the nativity of persons born in this period, give them a natural instinct for health and sanity, generally they manage to keep the balance true and avoid serious breakdown of any kind.
  But if circumstances push it too far in the direction of concentrated specialization, or if they give way to excessive emotion, the constitution will immediately suffer.
  Their most frequent symptoms of overstrain are connected with the kidneys, which are curiously sensitive.
  They have not a great deal of physical energy, though they possess good recuperative powers.
  They require an exceptional amount of fresh air and should, if possible, lead a simple life and be exceptionally careful in matters of diet.`,
  
  
    generalMarriage: `Marriages, unions, partnerships, etc.: Persons born in this period of the zodiac as a rule find their most harmonious relationship with those born in their own Sign.
  September 21st to October 20th (2nd House of the Air Triplicity).
  May 21st to June 20th (1st House of the Air Triplicity) January 21st to February 19th (3rd House of the Air Triplicity), and in the seven days "cusp" at the end of each of these periods.
  They are often attracted to persons born in the month of the zodiac the direct opposite of their own, in this case from the 21st of March to the end of April.`,
  
  
    numbers: {
     1: {
     character: `Persons Born on October 1st , 10th , 19th , 28th Number 1 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus, Venus and Saturn in The Zodiacal Sign of Libra, Second House of the Triplicity of Air, but if born on the 28th of October you will come under the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water, which will be explained later.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  In your special case, if born on the 1st, 10th, 19th or 28th of October, the stronger qualities described will be more dominant in your life and career.
  In this part of the year up to October 28th, Venus is in what is called its Negative House or aspect, while Saturn is in its "exaltation", Mars in its "detriment" and the Sun in its "fall".
  This peculiar combination will give you a wide range of character and disposition, but is unusually a favourable one for gaining prominence in the world, together with great opportunities from the standpoint of developing your own individual talents.
  The Sun in this position in the Zodiac will give you a sincere love of justice and balance with a desire to create the elements of peace and harmony in your surroundings, your instincts will be those of a "peacemaker", you will abhor bloodshed and war in all its forms, unless forced into it by your strong sense of justice.
  As Venus is in its Negative House you will crave for love and affection; you will sacrifice yourself for such things and yet gain very little satisfaction by so doing.
  You will have great ambitions but will be much restricted in carrying them into execution, always finding considerable opposition to your plans.
  Having the spirit of justice to others so ingrained in your nature you may do extremely well in the study of law, gaining prominence as conscientious lawyer or judge.
  You would also do well in some form of political life, but more from the standpoint of the "betterment of laws" than from that of the ordinary politician.
  Always seeking "the balance" and cause of things brought before your notice, you would also do well in the study of medicine and all kinds of research work.
  You will be inclined to make many enemies by your intense desire to present the facts you have gathered in forceful manner.
  If a person will not reason out things with you, you will have no use for them.
  There is a wide range of careers for those born on these dates in October.
  If you were born on the 28th of October your Sun has passed through the "cusp" of Libra and is in the Zodiacal Sign of Scorpio which will be fully explained when dealing with Number one persons in November.`,
  
  
      finance: `Finance: You will be more likely to gain money by mental occupations and the carrying out of your own individual ambitions than in ordinary lines of work.
  You will desire wealth for your purpose in life more than for personal accumulation.`,
  
  
      health: `Health: In matters of health you will have less to complain about than the average man or woman.
  As long as you are working at full tension you will keep well.
  Inaction would mean death to you.
  If you suffer at all it would more likely be caused by injuries from accidents than from anything else.
  In the case of accidents or wounds they will be more likely to the head and shoulders than to other parts of the body, but you will be liable to undergo operations on the stomach and intestines.`,
  
  
       importantNumbers: `Your most important numbers and dates will be "ones" and "sixes", such as dates making these numbers by natural addition, as the 1st, 6th, 10th, 15th, 19th, 24th and 28th in any month of the year.
  You will also find the numbers or their series of 4, 8 and 9 coming often across your path, but these I do not advise you to select as your numbers.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours belonging to the planets most favourable to you, such as the Sun: All shades of gold, yellow, orange to golden brown.
  Uranus: All shades of greys or electric colours.
  Venus: All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are diamonds, topaz, amber and sapphires.`,
      climactericYears: `The most important or climacteric years of your life are the 1st, 6th, 8th, 10th, 15th, 17th, 19th, 24th, 26th, 28th, 33rd, 35th, 37th, 42nd, 44th, 51st, 53rd, 55th, 60th, 62nd and 71st.`,
  
  
       magneticAttraction: `You will be attracted to people born on the series of "one", "four", "six", "eight", such as on the 1st, 4th, 6th, 8th, 10th, 13th, 15th, 17th, 19th, 22nd, 24th, 26th, 28th or 31st in any month of the year.`
     },
  
  
     2: {
     character: `Persons Born on October 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon, Neptune, Venus and Saturn in the Zodiacal Sign of Libra-the Balance, Second House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  You will have a strong gift of inspiration in whatever career you may follow, with a keen sense of intuition in any great emergency.
  You will be able to visualize the outcome of your plans and having done so you will carry them to execution in spite of every opposition.
  In ordinary matters of life you may be inclined to be too sensitive and feel criticism keenly, but the call of emergency will bring the strong side of your nature into action.
  For this reason you should be careful to decide on important issue when you are alone and free from the influence of the minds of others.
  At times you will be likely to suffer from moods and severe fits of depression and inclined to be doubtful of your own power of execution.
  At heart you will have a very affectionate nature, and feel the need of love deeply, but you will be so sensitive about such matters and so over-critical, that you will be liable to miss good opportunities as far as your affections are concerned.
  Persons born on the 2nd, 11th, 20th or 29th often do not marry unless they do so early in life.
  Those born on the 29th of the month at the commencement of the incoming Sign of Scorpio will be much influenced by their opposite sex and have many romantic episodes in the run of their lives.
  They will also be intensely fond of travel and living in countries or places far from where they were born.
  They will be fond of the ocean or broad expanses of water, but are likely to experience considerable danger of drowning or accidents during travel.
  If you were born on one of these dates in October, deep in your nature there will be a sincere appreciation for music, painting, poetry and all the fine arts; should your career lead you to such things you would find considerable success would attend your efforts.
  Whether a man or woman, you will have great taste in clothes, also a desire for luxury and the approbation of others.
  A person born on October 20th, when the Sun is entering the "cusp" of Scorpio, will be more self-confident than persons born on the 2nd or 11th.
  Those born on October 29th will have still more self- confidence, with greater chances for success, especially in art, literature, music, poetry or the drama.`,
  
  
       finance: `Finance: This will not be a favourable matter unless you develop more self-defence against persons trying to take advantage of you.
  Commercial businesses and routine work will be distasteful, but you may make money and success from your great gifts of imagination and inspiration in the call of emergency.
  If circumstances allow you to do so you will travel a great deal and take an interest in foreign countries, and meet success in connection with them.`,
  
  
       health: `Health: If you were born on any of these dates in October, in your early years you may not feel robust or have much strength physically.
  Mentally you will be overactive and your day dreams appear as realities.
  You will be inclined to suffer with some peculiar weakness of the back or spine and liable to slouch instead of keeping yourself straight and erect.
  You will be prone to catch cold easily and unless you take precautions you will be likely to have trouble with the throat, lungs and passages of the nose and ears.`,
  
  
       importantNumbers: `Your most important numbers and dates are the series of "twos", and "sevens", and you should endeavour to carry out your plans and engagements on the following dates in any month, such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.
  You should be guarded against doing anything important for yourself on dates making any number of the series of "four, eight or nine".`,
  
  
      colors: `To increase your magnetic vibrations, you should wear in some part of your clothing the colours of your most favourable planets, which are: The Moon: All shades of greens, creams and whites.
  Venus: All shades of blue, from the lightest to the darkest.
  Neptune: All shades of dove-greys, pastels and electric shades.`,
  
  
     jewels: `Your "lucky" jewels are green jade, pearls, moonstones, topaz, amber and turquoise.`,
  
  
       climactericYears: `Your most important or climacteric years are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You will be much attracted to people born in the series of two, and seven, such as on the 2nd, 7th, 11th, 16th, 20th, 25th and 29th in any month of the year.
  Your interchangeable number of the 1-4 will also cause people born in that series to have much to do with your life and career.`
     },
  
  
     3: {
     character: `Persons Born on October 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates in October, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Jupiter, Venus and Saturn in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  In your case, coming under, as you do, the influence of the powerful planet Jupiter, the stronger qualities will be more manifest and your ambition, willpower and determination will be marked characteristics of your career.
  This is such a favourable combination to be born under that you should make a considerable success in life, in whatever your purpose may be.
  You will have great ambition, no ordinary position will satisfy you, but yours will be of a very lofty noble order.
  You will rise over your fellows to hold position of responsibility and trust, but your greatest efforts will be to uplift humanity in general.
  Your nature will be sincere and conscientious in whatever you may do.
  You will be a lover of justice in every sense of the word, extremely charitable and philanthropic, ready to give your service and your money to public institutions, hospitals or asylums that your fellow men or women may be helped.
  In many ways you will be more charitable to institutions than you may be to individuals personally, but you are likely to be equally generous to members of your own family provided they will be willing to act on your advice.
  For fools and dissolute people you will have no use; your pocket may be open to them once, but not twice.
  You will be just, but at the same time severe.
  You will resent anyone trying to take an advantage over you.
  You will make friends easily with those of rank or in high positions, especially those connected with the Church, the Law, or holders of important positions in the government of any country in which you may be born.
  You will be a zealous supporter of "law and order", but at the same time a good employer to your work-people.
  You will be likely to have a happy marriage and home life and have great comfort from children.
  You will at times meet with enmity and attacks on your honour by jealous rivals, but such things you will care little about and not deviate an iota from your purpose.
  Persons born on the 21st of October have their Sun already in the 'cusp' of Scorpio.
  They will be very similar in characteristics to those born on the 3rd or 12th, but may not be quite as happy in their home life.
  Persons born on the 30th of October being already in the Zodiacal Sign of Scorpio are also under fortunate conditions for worldly success.`,
  
  
      finance: `Finance: Persons born on the 3rd, 12th, 21st or 30th of October as a general rule will be very fortunate in business, finance or industry.
  They will gain benefits from powerful friends, from their opposite sex or from marriage.`,
  
  
       health: `Health: The health of all these Number Three persons born on the 3rd, 12th, 21st or 30th of October, is as a rule good after their early years.
  The 21st year appears to be the turning point for them in all matters of health.
  It would be hard to pick out any illnesses they would be most prone to have.
  They will be liable, however, to meet with injuries from accidents during the run of their lives, especially those caused by motorcars, locomotion or transport.`,
  
  
       importantNumbers: `If born on one of the above dates your most important numbers and dates will come from the series of threes and sixes, such as the days in any month of the year, as the 3rd, 6th, 12th, 15th, 21st, 24th and 30th.
  You will find the series of eights and nines often coming into your life, but they will generally bring opposition or unhappiness into your career.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours of your most favourable planets, which are: Jupiter: All shades of mauve, violet or violet- purple.
  Venus: All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are the amethyst and all purple coloured stones, also the turquoise and all blue stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 3rd, 6th, 12th, 15th, 21st, 24th, 30th, 33rd, 39th, 42nd, 48th, 51st, 60th, 66th and 69th.`,
  
  
       magneticAttraction: `You will be likely to be much attracted to persons born in the series of three and six, such as those on the 3rd, 6th, 12th, 15th, 21st, 24th, 30th in any month of the year.`
     },
  
  
     4: {
     character: `Persons Born on October 4th , 13th , 22nd , 31st Number 4 People in This Month If you were born on any of the above dates in October, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibration of Uranus, the Sun, Venus and Saturn in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  In your individual case, if born on the 4th, 13th or 22nd of October, the conjoined influence of Uranus and Saturn is likely to make your life an unusual one, bringing many changes and strange experiences which will not seem under your control.
  Venus being in its negative House at this period of the year you will have out-of- the-way experiences in connection with love and marriage.
  You will be attracted to odd and more or less eccentric people who will not be too fortunate for you from a worldly point of view.
  If you like anyone very deeply no criticism of their actions will turn you against them.
  You will be rather headstrong in relation to all such matters and will be likely to meet opposition and estrangements from members of your family on this account.
  You will be liable to be drawn into tragic or sensational experience by reason of the people you will associate with and will pass under calumny and scandal even if you are yourself innocent of wrong doing.
  You will have unconventional views, rather on the eccentric order, with considerable gifts towards expression in literary and artistic work which you make good use of.
  Partnerships, unions or marriages are not likely to turn out well except under unusual circumstances entailing much self-sacrifice on your side.
  If you were born on October 31st you will be at the commencement of the Sign of Scorpio which would be more favourable for you as far as your personal advancement and material success is concerned.
  All these dates in October, such as the 4th, 13th, 22nd and 31st dispose persons to occult studies of a rather unusual nature, ability towards hypnotism, mesmeric or telepathic powers.
  Persons born on these dates as a general rule run a danger of injuries by accidents, such as by firearms, explosives, danger from the air, such as tempests, cyclones, lightning, also travel by air.`,
  
  
      finance: `Finance: Persons born on the 4th, 13th, 22nd or 31st of October have generally a hard, difficult road to climb, as far as financial matters are concerned, in their early years.
  They are either left without much money by their parents, or they choose some profession which at first does not give them much scope to show their abilities.
  As a rule, however, they succeed, especially those born on the 22nd or 31st of October.
  Their greatest danger is that no matter what money they gain they will make no provision for their advanced years, and often die in restricted circumstances.
  An example of this is the case of the famous Sarah Bernhardt, who started in poverty, won early success and riches as an actress and lost everything during the last years of her life.`,
      health: `Health: Persons born on the 4th or 13th of October may expect sudden illnesses of a more or less unusual kind: they are also liable to have operations on the throat, nose, face and internal organs.
  Those born on the 22nd or 31st of October are generally delicate in childhood, but from their thirty-first year they usually develop great resistance to disease.`,
  
  
       importantNumbers: `The most important numbers and dates for persons born on the 4th, 13th, 22nd and 31st of October are the series of "fours" and "eights".
  The important days in any month of the year are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, all of which, by natural addition, make the numbers of "four" and "eight".
  As I have fully explained in my Book of Numbers, I do not advise persons born on the above dates to use the numbers of four or eight or any of their series for any work coming from themselves.
  If born on the 4th, 8th, 13th, 17th, 22nd or 31st of October, I would advise you to employ such dates as are produced by the numbers of one or six or any of their series, such as the 1st, 6th, 10th, 15th, 19th, 24th or 28th.
  You would find yourself more fortunate by following this rule.`,
  
  
       colors: `In the same way in regard to "lucky" colours and jewels, I would advise you to employ in some part of your clothing the following: All shades of gold, yellow, orange to golden brown.
  All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `For "lucky" jewels use topaz, diamonds and turquoise.`,
  
  
       climactericYears: `The most important or climacteric years of your life (and this will be more or less outside of your control) are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th, 71st, 76th and 80th.`,
       magneticAttraction: `You will be much attracted to persons born in the series of the "four" and "eight" such as those born on the 4th, 8th, 13th, 17th, 22nd, 26th, 31st in any month of the year.`
     },
  
  
     5: {
      character: `Persons Born on October 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates, by the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury, Venus, Saturn and the Sun in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  In your special case the above planets form a very interesting combination and in a general way are very important in giving you strength of character.
  If you were born on one of the above dates, as Venus is in its negative House with Saturn in its 'exaltation," you may expect many unusual trials in all matters of your affections.
  For the most part of your life, you will be liable to sacrifice yourself to your strong sense of duty in caring for some parent or relative and giving up your plans and ambitions for this noble purpose.
  This will be all the harder for you, as you will feel that you are endowed with a mentality beyond the average and could make much of your talents if you had the freedom to go out into the world and make full use of your opportunities.
  You will have a very refined nature, anything coarse or vulgar would clash with your sensibilities.
  You will be kind, sympathetic and compassionate to any form of suffering, yet practical and "level-headed" with good judgment and excellent reasoning powers.
  Quiet and unassuming in manner, strong in your principles of right and honour, your greatest desire will be to bring harmony and peace to those around you.
  You will not be a "fighter" in the sense of bloodshed.
  You will detest "scenes" or quarrels, but will remain staunch to your principles and a defender to the death against injustice.
  Persons born on these dates in October are both versatile and adaptable.
  They can do almost anything their "hands find to do".
  They also easily adapt themselves to people and condition; they can get on well with all kinds of persons except those who are coarse and vulgar in their tastes and ideas.
  They can adapt themselves to live in a castle or a cottage with equal serenity.
  They do not crave for wealth, but they are anxious about their future, for this reason they are frugal and careful and they try hard to make wise provision for their advanced years.
  Persons born on the 14th of October, being in the exact center of the Sign of Libra, have all the qualities mentioned above, even more so than those born on the 5th or 23rd, but for the same reason they are inclined to suffer more deeply in their affections and usually have stronger ties from relations that keep them back from making more out of their lives.
  They make exceptionally good literary critics or proof readers, and they do well in writing if they can get the time away from others to devote themselves to such work.
  The 14th of October gives a very youthful and buoyant disposition.
  Persons born on this date nearly always create some mental philosophy of their own, that keeps them young at heart and makes them look young even in advanced life.`,
  
  
       finance: `Finance: In questions of money, persons born on the 5th, 14th or 23rd of October have good foresight in their advice to others; although they seldom can act on it for themselves.
  From their twenty-third year to their fiftieth, they often make a good income from some professional career or by their mental ability.
  They have good ideas in speculation and investments, but no matter what money they make there are so many demands on their generosity that they seldom if ever put much aside for their advanced years.`,
  
  
       health: `Health: Persons born on the 5th, 14th or 23rd of October suffer from highly strung nerves, they seldom have a vigorous or strong constitution, but are wiry and have great resistance to disease.
  As a rule they have to put up all their life with some peculiar delicacy of the stomach and especially the digestive organs.
  They cannot eat like other people and are particularly careful in matters of diet.
  They are prone to have nervous maladies such as twitching of the nerves in the eyes, face, hands and feet.
  They are liable to have attacks of tic douloureux in the tongue and mouth.
  Also spells of acute neuralgia.`,
  
  
       importantNumbers: `If you were born on the 5th, 14th or 23rd of October, your important numbers and dates are the "fives" and for secondary numbers, the "sixes", such as the 6th, 15th or 24th in any month of the year.`,
  
  
      colors: `Colours or jewels will not influence you as much as they appear to do in other person's lives.
  If anything, all light shades will be best for you.`,
  
  
      jewels: `Such jewels as diamonds and all glistening stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life will be the 5th, 14th, 23rd, 32nd, 41st, 50th, 68th, 77th, 86th and 95th.`,
  
  
      magneticAttraction: `You will be much attracted to persons born on the series of the "five" "six" and "eight", such as those born on the 5th, 6th, 8th, 14th, 15th, 17th, 23rd, 24th and 26th in any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on October 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates in October, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and Saturn in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  The basic foundation of your character and disposition is described in preceding pages for persons born in October.
  Venus in its negative House in this part of the year, will play a very important role in your life.
  You will create a large circle of friends and be a general favourite wherever you may live.
  You will have great personal magnetism and much influence and attraction for your opposite sex.
  You will love to entertain and have large expenditure, yet you will not be wasteful or unduly extravagant for you have the faculty of making "a big show" out of very little.
  You are likely to have many love affairs and more than one marriage, but you will have many trials, disappointments and curious experiences to pass through in such matters.
  Owing to your own individual talents you will rise to occupy high social positions and will draw persons of rank and wealth into your life.
  You will have great appreciation for literature, music, painting, poetry, drama, and the fine arts in general, and if you do not work in some of these things yourself, you will be a patron of them and have protégés in whom you will be interested, but if you want to follow any of these arts as a career you shall meet with considerable success.`,
  
  
       finance: `Finance: You will be fortunate in investments and in finance generally, especially if you follow your own intuition.
  You will be lucky in partnerships or in business investments in matters dealing with the public.`,
  
  
      health: `Health: On account of your having great recuperative power at the back of your constitution, you are not likely to have much illness, with the exception of having easily bruised flesh from which there may be some danger of tumours.
  In your early years you are likely to have inflamed tonsils and some trouble at the back of the tongue and throat.`,
  
  
       importantNumbers: `Your most important numbers and dates will be associated with the "six" and all its series, and dates such as the 6th, 15th and 24th, in any month of the year, but more especially during the month of May and October.`,
  
  
       colors: `To increase your magnetic vibrations you should wear the colours of Venus and the Sun in some part of your clothing, such as: The Sun: All shades of gold, yellow, orange to golden brown.
  Venus: All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are diamonds, topaz, amber and turquoise.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 6th, 15th, 24th, 33rd, 42nd, 51st, 60th and 69th.`,
  
  
      magneticAttraction: `You will be much attracted to people born in the "six" series, such as those born on the 6th, 15th or 24th in any month of the year.`
     },
  
  
     7: {
      character: `Persons Born on October 7th , 16th , 25th Number 7 People in This Month If you were born on any of the above dates in October, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, Venus and Saturn in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  But if born on October 25th, you are then far advanced in the "cusp" of Scorpio—the incoming Sign-making your characteristics in some ways more marked than if born on the 7th or 16th.
  The basic foundation of the character and disposition of persons born on the 7th, 16th or 25th of this month, is described in preceding pages for persons born in October.
  Persons born on these dates are mentally highly gifted, and if they can "keep their balance", they will turn out remarkable work in whatever career they have made their own, especially should it happen to be in the field of imagination such as poetry, literature, painting, music or the fine arts in general.
  Oscar Wilde, although a most brilliant poet, author and playwright, became so flattered by adulation that he believed he was above criticism, he "lost his balance", and "great was the fall thereof." I knew this brilliant man extremely well; several years before his "fall" I warned him what was coming, but he simply shrugged his shoulders and made no effort to change his mode of life.
  The 16th of October, being in the centre of the Sign of Libra the Balance, is more easily thrown off its "level" than persons born on the 7th or 25th of the same period.
  The 7th of October produces types so over-sensitive that they often seem to hold themselves back in whatever their work may be, while those born on the 25th, being far advanced in the "cusp" of Scorpio, are inclined to be daring and impulsive and more adventurous in their undertakings.
  Persons born on the 7th, 16th or 25th of October have a strong leaning for the unconventional in all their actions.
  On account of this peculiarity they attract hostile criticism, calumny and, in many cases, open scandal.
  It is not, as a rule, a favourable period in the Zodiac for marriage, unions or partnerships, unless great care is taken in such matters.`,
  
  
       finance: `Finance: All persons born on the 7th, 16th or 25th of October, will find much fluctuation in money matters.
  At times they may be quite rich, at others the very reverse.
  They will not, as a rule, be lucky in speculation, as their money would be easily taken from them by unscrupulous persons.
  The best advice I could give them, is to invest in government bonds and put up with a small but steady interest, and above all to buy an annuity to protect their advanced years.`,
      health: `Health: If you were born on any of these dates you may expect to meet many peculiar experiences in matters of health.
  You will be liable at times to run the risk of being poisoned by the food you eat, to be given poison by accident or to make it yourself by your own carelessness.
  The kidneys, liver, spleen and appendix are likely to give trouble.`,
  
  
       importantNumbers: `If you were born on the 7th, 16th or 25th of October, like all "number seven" people, your most important numbers and dates will be the "seven hyphen two" (7-2) and any of their series, and days of any month in the year such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th.
  You should endeavour to make your plans and engagements on these dates and live in houses that come under these series.`,
  
  
       colors: `To increase your magnetism you should wear in some part of your clothing the colours of your principal planets, which are: The Moon: All shades of green, creams and whites.
  Neptune: All shades of dove-greys, pastels or electric colours.
  Venus: All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are green jade, pearls, moonstones and turquoise.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
       magneticAttraction: `You are likely to be attracted to people born on the 2nd, 7th, 11th, 16th, 20th, 25th and 29th in any month of the year, also those born on the 1st, 10th, 19th and 28th.`
     },
  
  
     8: {
      character: `Persons Born on October 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates in October, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of Saturn and Venus in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  But if born on October 26th, you will be so far advanced in the "cusp" of Scorpio, the incoming Sign, that conditions will be more fortunate for you than if born on the 8th or 17th.
  The basic foundation of your character and disposition is described in preceding pages for persons born in this month.
  Persons born on these dates will not, as a rule have an easy time unless they have inherited money and have not to work hard to make their way.
  They will mentally be highly intellectual, more inclined to devote themselves to some serious study than coming out into social life.
  Men born on these dates in October make excellent doctors, scientists and lawyers.
  The women are deep readers, often writers on social reforms, become interested in far-reaching political questions that effect the masses, or they may throw themselves heart and soul into some cause which they believe is for the good of humanity at large.
  In all cases both men and women, as a rule, choose some difficult career in which they encounter great opposition to their views.
  From a worldly point of view they often become wealthy, if they do, they will employ their riches in some unusual way, such as founding institutions and hospitals for the furtherance of scientific research or in some cause of political reform.
  Persons born on these dates in October usually pass through great sorrows or afflictions.
  The loss of some loved one, the illness and death of a parent or close relative or an estrangement in family circles.
  Saturn is so powerful in this part of the year that persons born on the 8th, 17th or 26th of October are often raised into high positions —to see in their advanced years everything swept from them and their name attacked by calumny and scandal.
  If persons born on the above dates have to work as employees, they seldom get into positions that are congenial and so, as a rule, have very unhappy lives.
  They are much misunderstood by others and being of a reserved quiet disposition they are not good at defending themselves.
  As employees they often experience broken contracts and harsh treatment from superiors.`,
  
  
       finance: `Finance: In financial matters they are not as a rule lucky; unless they inherit property, if they do make money they have so many demands on it that it goes as fast as it is made.
  They are usually over-anxious about their future, if alone in life they are disposed to hoard up money in peculiar places and often have it lost or robbed.
  They should avoid all forms of speculation or gambles of every kind.
  Even in the higher types, such as scientists, doctors or lawyers, they find great difficulty in getting paid for the work they do.`,
  
  
      health: `Health: Persons born on the 8th, 17th or 26th of October, bring on many illnesses by mental despondency and turning over and over in their minds some injustice they have passed through.
  In many cases they foster the idea that they are martyrs and brood over their wrongs—real or very often imaginary.
  Their greatest danger is that they give way to melancholia which only makes matters worse for them, both physically and mentally.
  Their health, as a rule, is always peculiar, they do not easily assimilate their food, have a slow digestion, constipation, sluggish liver and severe headaches.
  If possible they should live an outdoor life, get plenty of exercise, live on a simple diet and eat as much fruit and vegetables as possible.`,
  
  
       importantNumbers: `If you were born on any of the dates I have mentioned, you will find the numbers of "fours" and "eights" coming into your affairs in the most unexpected ways.
  You will sooner or later notice how dates that produce these numbers are full of importance both in your career and in your private life.
  You will find how, without any planning on your part, you will even be attracted to houses whose numbers add up to the final digit of 4 or 8, to days of the month that produce these numbers, such as the 4th, 8th, 13th, 17th, 22nd, 26th or 31st, and to persons whose birthdays fall on these numbers.`,
  
  
      colors: `(Color preferences naturally align with the darker tones preferred by numbers 4 and 8, though not explicitly broken down apart from the jewels).`,
  
  
      jewels: `The jewels that appear more suitable for persons born on these dates are, black pearls, black diamonds and all dark stones.`,
  
  
       climactericYears: `For your climacteric years you must look out for the following ages of your life: the 8th, 17th, 26th, 35th, 44th, 53rd, 62nd, 71st and 80th.`,
  
  
      magneticAttraction: `You will find the numbers of "fours" and "eights" coming into your affairs.
  You will be attracted to houses, days, and persons whose numbers produce 4 or 8.`
     },
  
  
     9: {
      character: `Persons Born on October 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates in October, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars, Saturn and Venus in the Zodiacal Sign of Libra, Second House of the Triplicity of Air.
  But if born on October 27th you will be already in the incoming Sign of Scorpio the House of Mars (Negative) whose number is a "nine", which will increase the qualities attributed to Mars.
  The basic foundation of the character and disposition of persons born on the 9th, 18th or 27th of October is described in preceding pages for those born in October.
  In your individual case, if born on the 9th, 18th, or 27th, the Mars attributes will play an important part in your life and career.
  You will be rather inclined to be too rash and impulsive for your own good; you will cause opposition and create many enemies by your love of argument, and a mental desire to fight hard in defence of your ideas, principles and what you consider right.
  You would do better if you controlled your disposition in such matters and developed a more diplomatic way of acting.
  Although your natural qualities might make you a successful lawyer or debater, you will bring down on your head antagonistic criticism which will make even such a career a difficult one.
  As a surgeon you would be a success as Mars in this position gives ability with the "surgeon's knife" and rapidity with operations.
  You will also have a keen active brain towards science and new ideas in connection with such things, but at the same time you will be so strong and determined in your views that you will arouse much opposition.
  If you go into any form of business you will be of an enterprising disposition but may expect intense rivalry from competitors in whatever line of work you may engage in.
  You will be good in organization and as the head of large concerns, but in such a position, although likely to be successful, you will encounter opposition from your employees, strikes and even violence against your life.
  You would do best of all in some important government position where your ability for organisation would stand you in good stead.
  The opposite sex will have a great attraction for you, but you will be liable to have entanglements in your affections causing you much worry and annoyance.
  You will be likely by your impetuous nature to rush into an early marriage and have disputes and disagreements with your partners.
  The redeeming feature in any marriage you may make is, that you would have great consolation by children who would be likely to be very intellectual.
  In business, persons born on the 9th, 18th or 27th of October, would be more successful if working alone.`,
  
  
       finance: `Finance: As a general rule you will be successful.
  You will occupy positions of responsibility and authority, but never for very long, unless you develop control over your impetuous nature, quick temper and lack of diplomacy.`,
  
  
       health: `Health: In your early years you will be inclined to be delicate, to have many fevers, gastric troubles and inflammation of the blood causing ulcers, abscesses, carbuncles, boils and such like things, but from about your twenty-first year you would commence a new cycle regarding health and from that date out be strong and vigorous.
  You will be liable to meet danger from fires, explosives, accidents and attacks of violence against your life.
  You will be inclined to have trouble with the teeth, jaws, bones of the face and head and many wounds or injuries to this part of your anatomy.`,
  
  
       importantNumbers: `If you were born on the 9th, 18th or 27th of October, the "nine" and all its series will be the most important number in your life, next to it will be your secondary number of the "six".
  You should endeavour to make your plans and engagements fall on dates making these numbers, such as the 6th, 9th, 15th, 18th, 24th and 27th.`,
  
  
       colors: `You should wear, as much as possible, the colours of your principal planets, which are: Mars: All shades of crimson, red or rose.
  Venus: All shades of blue, from the lightest to the darkest.`,
  
  
      jewels: `Your "lucky" jewels are the ruby, garnet, the bloodstone, diamonds and turquoise.`,
  
  
      climactericYears: `The most important years of your life are governed by the number of "nine", in all its series, such as the 9th, 18th, 27th, 36th, 45th, 54th, 63rd, 72nd and 81st.`,
  
  
       magneticAttraction: `You will be attracted to people born in the series of "six" and "nine", such as those born on the 6th, 9th, 15th, 18th, 24th or 27th in any month of the year.`
           }
       }
   },
    november: {
     generalInfluence: `The zodiacal influence for the month of November in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Scorpio, Second House of the Water Triplicity whose ruler is Mars (Negative) commences on October 21st, but for seven days, being overlapped by the "cusp" of the previous Sign, it does not come into its full power until on or about October 28th.
  From this date onwards it is in full strength until November 20th, and is then for seven days gradually losing its force on account of becoming overlapped by the incoming Sign of Sagittarius.
  The Sign of Scorpio is represented by two Symbols—that of the Scorpion and the Eagle.
  Persons born in this part of the year, namely from October 21st to November 20th, and in the "cusp" to November 28th, are either extremely good or extremely bad.
  They either take after the qualities of the Scorpion or those of the Eagle.
  Up to about twenty-one years of age, they are generally extremely pure-minded, virtuous and religious, but if their sex-nature is aroused, they often swing in the opposite direction, and yet some of the most noble of the human species have been born in this Sign.
  All are, however, intensely emotional, which is the keynote of their nature in all its phases.
  Those born in this part of the year have unusual magnetic power, make excellent doctors, surgeons, healers, preachers and orators.
  In public life, they have great power over an audience and can sway it in any direction they please.
  They have command on language, both in speaking and writing, and are intensely dramatic in their power of description.
  Their greatest weakness is that they are by nature too adaptable to those with whom they are thrown into contact.
  In consequence, they often suffer from the faults of others.`,
  
  
    generalCharacter: `If they belong to the higher type of this Sign, they are at heart great humanitarians, extremely generous and self-sacrificing.
  In dangers and in sudden emergencies they are cool and resolute in action and can always be depended on in a crisis.
  They have extremely original ideas in either business, politics, literature or anything that engages their minds, and are usually successful in whatever they undertake.
  They suffer as a rule curious reverses of fortune; they are often strangely slandered by false rumours and stories circulated about them, and are more or less "Children of Fate" in the battle of life.
  They are mental fighters, more than on the physical side.
  They make good organizers if forced into warfare, but as a rule they detest bloodshed.
  They are excellent as diplomats and negotiators in any form, and excel in settling other people's quarrels and bringing enemies together.
  When they take more after the Scorpion Symbol of their Sign, in letters, writings or in speech, they can wound like the sting of a serpent, but as a rule on the slightest show of sorrow their anger is quickly over and they most readily forgive their enemies.
  Both the best and the worst in this sign are inclined in one way or another to lead some form of a "double life"—one for the eyes of the world-the other for themselves.
  When on the lower or more material plane, this tendency to lead a double life is more developed, in such cases they have been known to have a happy home life, apparently devoted to their wife and children, and at the same time keep up another establishment.
  On the higher plane, this peculiarity more affects their mental life, they generally follow two pursuits or two businesses and are often equally successful in both.
  Sooner or later, they usually become interested in occult matters; they readily develop intuitive power and quite often gain fame and distinction as writers, painters, poets or musicians.
  They are natural philosophers, deep students of nature and observe and analyze other persons' characters extremely well.
  They are generally loved and adored by those who know them but there are very few born under this Sign who at some stage in their career escape from being attacked by some insidious form of calumny or scandal.
  Persons born in this period generally have or make two sources of income.
  As a rule they go through a great deal of trouble, difficulty and often privation in their early years; but such trials seem to increase their will power and ambition and sooner or later success and fame nearly always crown their efforts.
  Those born in this Sign of Scorpio are extremely hard workers in any profession or business in which they are associated.
  They do not spare themselves in any way.
  Their will-power and determination forces them onward like a lash to take on work and still more work.
  They have good inventive ability and are resourceful in whatever they do.
  They make able government servants, being particularly gifted in handling diplomatic situations or being engaged on secret missions.
  They often make successful detectives or police executives, having a peculiar instinct in unearthing crime.
  Those born in the Sign of Scorpio also make good scientists, chemists or assayers, especially in everything concerning liquids.
  They have often an inclination to engage in dangerous enterprises such as the discovery of hidden treasure, lost mines and anything that relates to the mysterious, and often risk their lives in such pursuits.
  The higher Scorpio type take a deep interest in all forms of occultism and psychical research, while the lower type incline toward association with the "under-world" and secret societies.
  The higher type usually marry well—they often gain riches by marriage or if they do not do this, at least they are inclined to mate with someone of their opposite sex who is on a high intellectual plane or who has made a name in the world for themselves.`,
  
  
    generalFinance: `Finance: Persons born in this period of the year, as a rule experience the most unusual "ups and downs" of fortune.
  They are inclined to be too trustful and over-hopeful.
  They are easily persuaded into schemes that have no solid foundation.
  As their Sign in the Zodiac represents the Second House of the Water Triplicity, the symbolism of Water as an uncertain changeable element, seems to be the base of all their undertakings.
  They are also over-generous and inclined to be too lavish in their expenditure.
  They have little self-defence against any appeal for help, especially if it comes from one of their opposite sex.
  Money seems "to burn in their pocket", they may make it by their mental abilities but they seldom can hoard it up to any great extent.
  If circumstances permit them they will travel considerably and easily adapt themselves to new conditions and surroundings.`,
  
  
    generalHealth: `Health: In their early years persons born in Scorpio are usually delicate and pass through more than the average amount of childhood's ailments.
  Their illnesses are generally related to the large intestine and excretory part of the system.
  They are liable to suffer from such things as fistula, hemorrhoids, inflammation of the bladder, dangers to the sex organs in both men and women, and trouble with the glands of the body.
  In passing through life they seldom escape from having some accident or permanent injury to their hands.
  The upper part of the lungs is usually a weak spot, as is also the bronchial tubes.
  In all cases, persons born in Scorpio, after their twenty-first year, exhibit an extraordinary resistance to disease.`,
  
  
    generalMarriage: `Marriages, Unions, Partnerships, etc.: Persons born in the Sign of Scorpio will find their most harmonious relationships with those born in their own period of the Zodiac, October 21st to November 20th, Second House of the Triplicity of Water.
  June 21st to July 20th, first House of the Water Triplicity.
  February 19th to March 20th, Third House of the Water Triplicity, and in the seven days of the "cusp" at the beginning or ending of each of these periods.
  They are also much influenced by persons born in the part of the year the exact opposite in the Zodiac to their own, in this case people born between April 20th and May 27th.`,
    numbers: {
     1: {
     character: `Persons Born on November 1st, 10th, 19th, 28th Number 1 People in This Month If you were born on any of the above dates in November, following the rules of Zodiacal Astrology, combined with my system of Chaldean Numerology, you come under the vibrations of the Sun, Uranus in its "exaltation" with Mars (Negative), in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in November.
  In your special case, if born on the 1st, 10th or 19th (the 28th being in Sagittarius, will be explained later) the stronger qualities will be more dominant in your life and career.
  All "number one" people in November, under which heading you come, represent the Sun and the Sun being exceptionally powerful in its influence in Scorpio, the Second House of Mars, persons born on the 1st, 10th or 19th of November will be specially governed by its magnetic rays.
  On account of this position of the "Giver of Life" persons born on the above dates radiate enormous energy and have great influence over others.
  They are creative in every sense of the word, forceful and dominant.
  They have good ideas for the government of others and often make a great success in political life.
  They are observant and critical, rather aggressive and determined in their plans, yet courteous and helpful to those beneath them.
  They have a keen sense of wit and humour, but are apt to reduce the most serious questions to ridicule by their love of the sarcastic which can sting like a scorpion's tail.
  They are sensitive and easily hurt by neglect, but never bear angry thoughts for long.
  If anything, they are too large-hearted and forgiving to their enemies.
  All persons born on the 1st, 10th, 19th and including the 28th of November like large bold enterprises; they can succeed well as contractors, architects, engineers on big schemes, or builders of daring original designs.
  From another point of view they have great creative ability in literature, also as dramatists, lecturers and in many cases they make success on the stage.
  Persons born on November 28th come under the Sign of Sagittarius ruled by Jupiter (Positive), in the Third House of the Fire Triplicity.
  At heart they are extremely ambitious; they generally make a name for themselves and gain prominence in whatever their career may be, but they are seldom as lucky in money as the other "Number One" persons born in the Sign of Scorpio.`,
  
  
       finance: `Finance: I have said enough in preceding paragraphs to show that if you were born on the 1st, 10th, 19th or 28th of November you may expect to make money and be successful in life.
  Your only difficulty will be to keep what you gain.`,
  
  
       health: `Health: All those born on the dates mentioned appear to change their conditions of health from or about the twenty-first year.
  Up to that age they are often delicate, especially so during childhood.
  If they live to the twenty-first birthday they become strong and vigorous and show great resistance to disease.
  They are liable to suffer with the throat, lungs and bronchial tubes.
  They should never live in cold damp climates, but should get as much beneficial rays from the Sun, as possible.`,
  
  
       importantNumbers: `Your most important numbers and dates will cover a wide range.
  All "Number One" persons represent the Sun and Uranus, whose numbers are written in this study as one hyphen four (1-4).
  Their interchangeable numbers are given by the Moon and Neptune and written as two hyphen seven (2-7).
  For this reason your important numbers and dates are the 1st, 2nd, 4th, 7th, 10th, 11th, 13th, 16th, 19th, 20th, 22nd, 25th, 28th, 29th, 31st.
  You should try to use these dates in carrying out your plans or in making engagements.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours belonging to your planets, such as: The Sun: All shades of gold, yellow, bronze, orange or golden brown.
  Uranus: All shades of blue-greys, pastel or electric colours.
  The Moon: All shades of green, cream and white.
  Neptune: All shades of dove-greys and electric colours.`,
  
  
     jewels: `Your "lucky" jewels are diamonds, topaz, amber, moon-stones and sapphires.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 4th, 10th, 13th, 19th, 22nd, 28th, 31st, 37th, 40th, 46th, 55th, 58th, 64th, 67th, 73rd, 76th and 82nd.`,
  
  
        magneticAttraction: `You will be much attracted to persons born in your own series of the one hyphen four (1-4), together with its interchangeable numbers of the two hyphen seven (2-7) in any month of the year.`
     },
  
  
     2: {
     character: `Persons Born on November 2nd, 11th, 20th, 29th Number 2 People in This Month If you were born on the 2nd, 11th or 20th of November, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon, Neptune and Mars, in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The 29th of November does not come under this classification, as this date is under Sagittarius, Third House of the Triplicity of Fire with Jupiter (Positive) as its Ruler, and will be explained later.
  The basic foundation of the character and disposition of persons born on the 2nd, 11th or 20th of November is described in preceding pages for persons born in November.
  The Moon being in its "Fall" in this Sign of Scorpio in the House of Mars negative, brings about a very peculiar combination and one full of the most contradictory conditions.
  This is by no means a good position for the Moon to occupy; in consequence, persons born on the above dates in November should very carefully examine their tendencies in order to make the best out of their lives.
  They should, above all, make every effort to be decisive in their decisions, and more self-reliant.
  One of their marked peculiarities is that they find it almost impossible in their early years to decide what career they ought to follow.
  They have plenty of talent for artistic or imaginative work, but they are too much inclined to live in a dreamland all their own, and not make a practical use of what might be genius if it got a chance of cultivation.
  They are disposed to trust to the help of others to get them through, and consequently have many bitter disappointments and find life a very hard battlefield for which, as a rule, they are totally unprepared.
  Women born on the dates mentioned, as a rule, suffer more than men.
  They are so highly emotional and sentimental they generally marry the wrong man and go on unwittingly to their own doom.
  Marie Antoinette, Queen of France, born November 2nd, is an example of this type.
  She married the king, but every action of her life paved the way to the guillotine.
  Both sexes born on the dates quoted are inclined to lose themselves in a maze of romance and pay too high a price for so-called love.
  They are easily attracted to their opposite sex, but the ties of affection rarely last.
  The sharp rocks of the Divorce Court may bruise their flesh for the time being, but as a rule they make the same mistakes of judgement over and over again.
  And yet what successes such persons could be if they would make the effort to control the sentimental side of their nature and allow any one of their hidden talents to come to the surface.
  Think of the poets, painters, writers or musicians that these dates in the Sign of Scorpio conceal.
  If you were born on one of them, I most earnestly advise you to concentrate your mind on some one object.
  First win success in some one thing, then you can play with the butterfly of romance as much as you like.
  If born on November 29th, at the commencement of the incoming Sign of Sagittarius, ruled by Jupiter, you will be much more positive in your character and more fortunate in carrying out your plans to a successful issue.`,
  
  
      finance: `Finance: Unless you are extremely prudent and careful, you will have much anxiety over money matters.
  You may gain at times wealth and property by your own efforts or by marriage, but such good fortune is not likely to last.
  You could make money by developing your own talents, and not by relying on the promises of others.`,
  
  
       health: `Health: You will be inclined not to be robust or physically very strong.
  You should husband your strength as much as possible and not overstrain your nervous system which you will be inclined to do.
  You will be disposed to suffer from internal debility, and weakness or inflammation of the sex organs.
  The passages of the nose, throat and ears are likely to cause trouble, restlessness at night and insomnia are also prone to occur.
  You will be so oversensitive that unhappy surroundings will have a bad effect on your health.
  You will be liable to have extreme fits of mental depression that you should make every effort to overcome.`,
  
  
       importantNumbers: `Your most important numbers and dates for making your plans or engagements are those that come under the "twos" and "sevens" and all their series such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th, of any month of the year.
  You should be guarded against doing anything important for yourself on dates making any number of the series of "four, eight or nine".`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours belonging to your planets, which are: The Moon: All shades of green, creams and white.
  Neptune: All shades of dove-greys, pastel or "electric colours."`,
      jewels: `Your "lucky" jewels are green jade, pearls and moon- stones and rubies.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th, 61st, 65th and 70th.`,
  
  
      magneticAttraction: `You are likely to be much attracted to persons born in the series of your own numbers, the two hyphen seven (2-7), together with its inter-changeable numbers, the one hyphen four (1-4) in any month of the year.`
     },
  
  
     3: {
     character: `Persons Born on November 3rd, 12th, 21st, 30th Number 3 People in This Month If you were born on any of the above dates as far as November 21st, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Jupiter and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The 30th of November, being in the Sign of Sagittarius, comes under a different classification and will be explained later.
  The Basic foundation of your character and disposition is described in preceding pages for persons born under Scorpio in November.
  The combination of Jupiter and Mars in this part of the Zodiac is a very powerful one, which if you make good use of will undoubtedly reward you with success and prominence in whatever career you may make your own.
  You will have considerable self-confidence and belief in yourself.
  These qualities will stand you in good stead on account of the responsibilities that must sooner or later fall on your shoulders.
  During the early years of your life there will be many obstacles and difficulties to overcome.
  The loss of a parent and consequent loss of protection and perhaps money may be one of these handicaps.
  Such difficulties in your case would be, however, blessings in disguise.
  They would train you to take on early responsibility.
  If you will look back to the years even of childhood, you will see that for one reason or another, your little shoulders had to take on a burden of care, or you had to "look after the others." As life went on responsibilities became still heavier; you had to become in one way or another "the head of the family." All this may have made things hard at the commencement, it may even have delayed you in the plans and purposes already forming in your mind—it was, however, necessary for the formation of character, perhaps, designed to fit you in the end to be worthy of being a child of Jupiter and Mars in the Sign of Scorpio.
  Whether you grew up to be a man or woman, without being unduly conceited or egotistical, you always felt in you a feeling of conscious superiority.
  You seemed to know deep down in your heart that you had the ability to do big things and that if you could only get a fair chance you would do them.
  That is the reason you have never shirked responsibility when it came your way.
  When you were offered the position of Secretary to your Club you took it, later on you became its President and so on in an ever ascending scale.
  If a woman, you might also have taken a very similar course, or demands on your time may have forced you to take on the responsibilities of a home, the bringing up of children, etc.
  Now let me analyze your faults and weaknesses, for even the best must have some.
  Be you a man or woman, the danger is that you may take too much on your shoulders and so break down by over- work or from nervous strain.
  You may also have a tendency to become too authoritative or dictatorial to those around you and so cause trouble from servants, employees or inferiors.
  By this weakness you may have made enemies and so became embittered or disappointed with people or things in general.
  If any of these conditions have occurred, you have only to get back to your original foundation, take the blame on your own shoulders and start all over again, knowing that you have it in you to conquer such weaknesses.
  If born on November 30th, the first number three in the incoming Sign of Sagittarius, House of Jupiter (Positive), you may expect a great amount of success to reward your efforts.`,
       finance: `Finance: You will always be able to make money in whatever line of work it "has pleased God to call you".
  Your danger is that you may over reach yourself by attempting too much, or have a breakdown in health that for the time being would put you "out of the running".`,
  
  
      health: `Health: In matters of health you will only have yourself to take to task, if you should break down through over- work or taking too much on your shoulders.
  It may, however, encourage you to know that you were born under perhaps one of the most healthy conditions of all the Signs of the Zodiac.
  In your case, born on the 3rd, 12th, 21st or 30th of November, it is only worry and fear that can bring on illness, but if it does come it will be severe and may set you back for a long time.
  As you advance in years the heart may be likely to give trouble, you will have a tendency for high blood pressure and constant headache.
  The cure, as well as the disease, lies in your own hands- lessen your responsibilities, subject yourself to a simple diet and above all get as much sleep as possible.`,
  
  
       importantNumbers: `Your most important numbers and dates are those of the "threes" and "nines" in any month of the year, but in your case more especially so in November, December, end of February, March, April and May.
  You should endeavour to make your plans and engagements fall on dates such as the 3rd, 9th, 12th, 18th, 21st, 27th and 30th.`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing the colours of your two most important planets, which are: Jupiter: All shades of mauve, or violet-purple.
  Mars: All shades of crimson, red and rose.`,
  
  
      jewels: `Your "lucky" jewels are the amethyst, all violet or purple coloured stones, the turquoise and all blue stones.`,
      climactericYears: `The most important of climacteric years of your life are the 3rd, 9th, 12th, 18th, 21st, 27th, 30th, 48th, 54th, 57th, 63rd, 66th, 72nd and 75th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "three" and "nine", such as those born on the 3rd, 9th, 12th, 18th, 21st, 27th, 30th in any month of the year.`
     },
  
  
     4: {
     character: `Persons Born on November 4th, 13th, 22nd Number 4 People in This Month If you were born on any of the above dates, as far as November 22nd, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus, the Sun and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The 31st of November, being in the Sign of Sagittarius, comes under a different classification and will be explained later.
  The basic foundation of your character and disposition is described in preceding pages for persons born under Scorpio in November.
  Uranus, the Sun and Mars in Scorpio produces a curious complexity of character.
  It is one of the peculiar combinations in the Zodiac.
  It must be borne in mind that Uranus and Mars are the most disruptive planets in the solar system and when they come together in Scorpio the House of Mars (Negative), it is the extraordinary that must be expected.
  The famous astrologer, William Lilly, writing as far back as 1647 speaking of Uranus says: "Persons under the influence of this planet are partial to all uncommon studies.
  They are likely to strike out for novelties and to be remarkable for an inventive faculty." Other celebrated astrologers, such as Evangeline Adams, whom I knew intimately, in her excellent work Astrology published in 1930 speaking of Uranus and Scorpio, says "There is naturally a strong affinity between Uranus and Scorpio, with some persons, the spirit of scientific investigation which is an important element of Scorpio will be brought out very strongly; with others the treacherous, subtle-witted quality of that mysterious sign; and in a third group, we may find its sensuality and passion most deeply marked." Persons born on the 31st of October (the first of the "Number Fours" in Scorpio) followed by the 4th, 13th and 22nd of November, are capable of doing remarkable things under the influence of Uranus, but let me add there is no combination in the entire Zodiac where the most absolute self-control is so much required.
  Persons born on the above dates, can if they set their minds to the task, rise to great prominence in life and make good use of their splendid gifts of inventiveness, Originality and even their eccentricity, which is a very decided part of their disposition, but they must hold these qualities well under the checkrein of their will-power and determination.
  Such persons should aim to develop the spiritual side of their mentality so that they may be proof against the "slings and arrows of outrageous fortune".
  If they do not do this, they will be likely to become embittered by the way people are likely to treat them.
  They must expect to be terribly misunderstood in their thoughts, actions and deeds.
  Their originality and eccentricities held up to ridicule, great injustice dealt out to them and to find in general the world a very hard school and its lessons very difficult to comprehend.
  If they should lose faith in the Great Design of which they are a part, or allow that mental Mars at the back of their nature to join forces with the disruptive qualities of Uranus, they will then be likely to turn against all good and bring down on their heads more suffering than is the usual lot of mortals.
  All these persons born on 31st of October, 4th, 13th and 22nd of November should endeavour to curb the eccentric side of their disposition which may lead them into dangerous positions if they do not keep it well under control.
  The good qualities of those born under the combination of Uranus and Mars are their devotion to whatever they believe is their duty.
  Their desire for reform, either in connection with the laws of the country in which they live or reform in social life.
  I would advise all these persons to aim at producing harmony and love in their surroundings and when they have found peace in themselves, to develop the finer and more spiritual side of their nature.`,
  
  
        finance: `Finance: Persons born on these dates in November should be cautious and prudent in money matters and depend as little as possible on the help or promises of others.
  It is not a favourable Sign for associations or partnerships, but such persons often make success by their own unconventional original ideas.
  They sometimes succeed well in literary work or from inventions of an advanced type such as in the electrical field, wireless, radio, motion pictures, television and such like pursuits.`,
  
  
       health: `Health: In all matters of health, the persons born on the dates I have referred to, should keep before them that ill-health is only a question of their mental outlook on life in general.
  If they allow the disruptive elements of Mars and Uranus in Scorpio to get the better of them, they will then be prone to attract the illnesses that these planets represent.
  Mental worry will be liable to wrack their nerves bringing in its train nervous dyspepsia, stomach trouble, internal lesions, tumours, auto-poisoning, weakness of the heart, poor circulation of the blood, etc.
  They should try to keep a bright outlook on life and endeavour to fit in with their surroundings.`,
  
  
       importantNumbers: `If you were born on any of the dates mentioned, your important numbers will come under the series of "fours," "eights" and "nines" and dates in any month such as the 4th, 8th, 9th, 13th, 17th, 18th, 22nd, 26th, 27th and 31st.`,
  
  
       colors: `The colours that would give you the best vibration are all shades of sapphire blue, also crimson, red or rose.`,
  
  
      jewels: `Your "lucky" jewels are sapphires, rubies, garnets, all red stones and bloodstones.`,
      climactericYears: `The most important or climacteric years of your life are the 4th, 8th, 9th, 13th, 17th, 18th, 22nd, 26th, 27th, 31st, 35th, 36th, 40th, 44th, 45th, 49th, 53rd, 54th, 58th, 62nd, 63rd, 67th and 71st.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "four", "eight" and "nine" in any month of the year.`
     },
  
  
     5: {
      character: `Persons Born on November 5th, 14th, 23rd Number 5 People in This Month If you were born on any of the above dates in November, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in November.
  Mercury in this House of Mars (Negative), will make you very quick-witted with considerable mental ability, great capacity for organization and good judgement regarding your fellow-beings.
  You will be keen, shrewd and inclined to be suspicious and mistrustful of others, but likely to make money by unusual methods or in some class of profession or career rather out of the ordinary run.
  You will have a deep love of art and beauty and will be highly gifted in all imaginative work.
  You will be much attracted to your opposite sex, have many love affairs but be rather changeable and inconsistent in your affections, none of these "affairs" making any deep or lasting effect on your nature.
  In consequence of your disposition, you would do better not to marry, or at least until past middle life.
  You are inclined to be restless, to travel as much as possible if your circumstances will permit it, and to have many changes of residence.`,
       finance: `Finance: Persons born on the dates mentioned are likely to be very fortunate in money matters; at least in streaks of good luck; but owing to the combination of Mars they are disposed to be disruptive and not likely to keep what they gain.`,
  
  
      health: `Health: If you were born on one of these dates in November, you will be liable to run the whole gamut of children's ailments during your early years, but later you will be of the "wiry type," quickly throwing off illness, but always keyed up to high nervous tension.
  Being easily irritated and annoyed, especially over little things, you will at times show a violent temper which will act as a poison in your system.
  You will have, on the whole, a rather healthy life, but the likelihood is of some sudden ending to your life without any lengthy illness.`,
  
  
       importantNumbers: `If you were born on the 5th, 14th, or 23rd of November, your important numbers will come under the series of "five" and "nines" and dates in any month such as the 5th, 9th, 14th, 18th, 23rd and 27th.`,
  
  
      colors: `The colours most fortunate for you are all light shades, such as white, creams or silvery glistening materials, also crimson, reds and rose, but in your case these should be of the softer tints.`,
  
  
      jewels: `Your "lucky" Jewels are diamonds, all light glittering ornaments, also rubies, garnets and all red stones.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 5th, 9th, 14th, 18th, 23rd, 27th, 32nd, 36th, 41st, 45th, 50th, 58th, 63rd, 68th and 72nd.`,
  
  
       magneticAttraction: `You will be to a certain extent, attracted to people born in the series of the "five" and "nine", such as persons born on the 5th, 9th, 14th, 18th, 23rd, 27th in any month of the year.`
     },
  
  
     6: {
      character: `Persons Born on November 6th, 15th, 24th Number 6 People in This Month If you were born on any of the above dates in November, following the rules of the Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The basic foundation your character and disposition is described in preceding pages for persons born in November.
  Venus, in the House of Mars (Negative), is a rather fortunate Sign in many ways, except for disappointment in love and trouble caused by the affections in general.
  Such persons have extremely lovable natures, most self-sacrificing to relatives or parents, but as a rule have always some one to support or care for.
  They may expect to meet with many difficulties and hardships in their early years, such as the death of a parent which throws responsibility on their shoulders and holds them back in following out their ambitions.
  If born in affluence or social position, they will find things equally hard, as then they are likely to be expected to give up whatever their pet hobby may be and follow a life in accordance with the wishes of others.
  In such a case, in order to get their freedom, they will be disposed to marry early, generally to some one beneath their station and so make trouble for themselves at the very commencement.
  Such persons born on the dates mentioned, have strong magnetic attraction for their opposite sex, but as a rule they do not choose well-love blinds their eyes to the faults of others.
  In many other cases they meet with long delays in marriage and in a moment of impetuosity rush off and marry the wrong person.
  Terrible tragedies caused by love often come into their lives; they have great jealousies to contend against.
  The later in life these people under Venus in Scorpio marry, the more chance they will have of happiness and success.
  Their talents lie more in the direction of an artistic life.
  They would do well in music, especially in concert or opera, also in painting, in sculpture or the stage, sometimes as writers.
  They often are forced into positions of great responsibility and come under the "lime- light" of much publicity.
  If they should by circumstances be placed in the routine of a business life, they work hard and are extremely conscientious in service to their employer.
  In fact in such positions they are generally too self-sacrificing to his or her interest, or to the responsibilities they may be called on to face.
  Persons born on November 6th, 15th, 24th are almost certain to gain fame and honour in whatever career they adopt and in many cases great wealth and high position.`,
  
  
       finance: `Finance: As a rule persons born on the above dates are fortunate in money matters if they follow their own intuitions.
  They can make money and also keep it, in spite of having luxurious tastes, especially as regards dress and keeping up a good appearance.
  Women born on these dates very often marry well, especially if they marry late in life.`,
  
  
       health: `Health: Those born on the 6th, 15th or 24th of November are, as a rule, very healthy and have strong constitutions.
  Their chief danger is that as they advance in years they are inclined to put on flesh and are liable to heart disease towards the end of life.
  They are also prone to suffer with inflammation of the lungs, throat, nasal passages and the middle ear.`,
  
  
      importantNumbers: `If you were born on the 6th, 15th or 24th of November, your important numbers will be the series of "Sixes" and "Nines".
  Your best dates to carry out your plans and engagements are the 6th, 9th, 15th, 18th, 24th and 27th in any month of the year, especially during April and May, October and November.`,
  
  
       colors: `To increase your magnetic vibrations you should wear the colours of: Venus: All shades of blue, from the lightest to the darkest.
  Mars: All shades of crimson, reds or rose.`,
  
  
      jewels: `Your "lucky" jewels are the turquoise, or all blue stones; also rubies, garnets and red stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 6th, 9th, 15th, 18th, 24th, 27th, 33rd, 36th, 42nd, 45th, 51st, 54th, 60th, 63rd and 69th.`,
  
  
       magneticAttraction: `You will be likely to be attracted to people born in the series of the "six" and "nine" such as those on the 6th, 9th, 15th, 18th, 24th, 27th of any month of the year.`
     },
  
  
     7: {
      character: `Persons Born on November 7th, 16th, 25th Number 7 People in This Month If you were born on any of the above dates in November, following the Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in November.
  Neptune governs the mental more than the physical qualities.
  It rules the hidden attributes of the mind, such as the sub-conscious, producing weird dreams, visions, hallucinations and the higher inventive abilities.
  In the Sign of Scorpio, house of Mars (Negative), it has very considerable power, as Mars being negative in this sign also may be termed a mental planet, and so likewise is the Moon.
  If you were born on the 7th, 16th or 25th of November you will be directly under this peculiar combination.
  You will be over sensitive to people and your surroundings; if trying to live under unhappy conditions you will be extremely unhappy and discontented; you will be inclined to be too introspective for your own good and find it difficult to mix with other people.
  You will have a deep love of what is called the "secret arts" such as chemistry of the higher class.
  You will be good in all forms of scientific research, or as a psychologist you will study the inner workings of the human brain.
  You will be inclined to live apart from material things and will be likely to be considered a "crank" for so doing.
  You could, however, rise to great prominence in following out your own ideas.
  You will have unusual persistency in anything you may undertake.
  You will also be extremely secretive and reserved.
  This combination also inclines to the study of occultism, mysticism, hypnotism and such like things, but in all cases it is the mental that will attract you, more than the material.
  You may also develop into a "healer" or advanced worker on "new thought" lines.
  You will be much misjudged and misunderstood, but although over sensitive to the actions of others you will be more or less indifferent to their opinions.`,
  
  
      finance: `Finance: Although you are not inclined to devote your abilities to material gain, you will be likely to receive financial benefits in odd and peculiar ways, also by gifts and legacies by your discoveries in science or invention or by your own intuition of what should be done at the right moment.`,
  
  
       health: `Health: You will not be inclined to be physically very strong.
  You will be liable to over-tax the mental side of your nature; but at the same time you will be likely to develop some peculiar philosophy of your own in regard to diet that will enable you to live out the average span of life.`,
      importantNumbers: `Your important and fadic numbers will belong to the series of "twos", "sevens" and "nines"; also dates in any month of the year such as the 2nd, 7th, 9th, 11th, 16th, 18th, 20th, 25th or 27th, and you should endeavour to carry out your plans or engagements as much as possible on these dates.`,
  
  
      colors: `In order to increase your magnetic vibrations, you should wear in some part of your clothing the colours of: The Moon: All shades of green, white and creams.
  Neptune: All shades of dove-greys, pastels or electric colours.
  Mars: All shades of crimson, red or rose, but in your case the softer or more delicate shades.`,
  
  
      jewels: `Your "lucky" jewels are green and grey jade, moss- agate, moonstones, pearls; also rubies, garnets and stones of a reddish colour.`,
  
  
        climactericYears: `The most important or climacteric years in life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 38th, 43rd, 47th, 52nd, 56th and 70th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the two hyphen seven (2-7) and its interchangeable numbers of the one hyphen four (1-4), in any month of the year.`
     },
  
  
     8: {
      character: `Persons Born on November 8th, 17th, 26th Number 8 People in This Month If you were born on any of the above dates in November, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Saturn and Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water.
  The basic foundation of your character and disposition is described in preceding pages for persons born in November.
  I regret to say that the above dates are by no means a fortunate combination to be born under, unless you develop great self- control and are determined to make full use of some of the splendid abilities you are given.
  Saturn has been described by many astrologers as "the old school master of the heavens," and he certainly does punish his children with the utmost severity, especially during their years.
  Mars in this part of the year, as it is in its negative sign, is however standing (if I may term it so) at your back, to help you by means of your mentality to overcome the fatalistic influence of Saturn.
  It is only, however, by the development of your mental faculties that you will make headway and gain as much success as others in the scheme of life, in which the Great Designer, has placed you.
  It may be that victory over self is the greatest victory of all.
  If you were born especially on the 8th or 17th of November, you may expect to have a very steep hill to climb during your early life.
  The 26th of November would be more fortunate as it is in the "cusp" of the incoming House of Jupiter, but at the same time it will be strongly influenced by the fatalistic tendencies of Saturn.
  In your case, if born on the 8th or 17th of November, you will be inclined to be self-willed and difficult to get on with.
  You will be prone to possess much persistency of views whether right or wrong.
  You will be rather one-sided in your way of looking at things, suspicious of people's actions even when they are for your good, inclined to feel that everyone's hand is against you, and if you do not conquer such feelings you run the risk of becoming afflicted with what is called "the folly of persecution." You will be liable to bring great sorrow into your life through unfavourable love affairs and secret alliances.
  You will be egotistical in such matters, and find it difficult to accept advice.
  In spite of all this, you will have an extremely clever brain; your persistency could be put to good use in striving for the object you want to accomplish.
  Your intense love nature could be raised by self-sacrifice to the highest plane of thought.
  Your strong emotional temperament, if under proper control, could be the lever to remove all obstacles from your path, and win people to you.
  As a rule, the first thirty-five and up to the fortieth year, are the hardest for persons born on the 8th or 17th of November, particularly so for those who come into the world on the latter date.
  If they can get through this first period without shipwreck, they are likely to grow out of their earlier tendencies and do well for the following thirty-five years.`,
  
  
      finance: `Finance: In this again it depends on yourself whether you will get a great success or a failure.
  There is no middle path for you-it will be one extreme or the other.
  You will be likely to win your way by your dogged persistency in following out some one thing that you want to do.`,
  
  
      health: `Health: In matters of health you will either be extremely strong, or the reverse.
  You may be liable to such things as carbuncles, boils and severe abscesses.
  You are also likely to suffer from rheumatism or rheumatic fevers.
  You should avoid the use of drugs or stimulating liquors which, in your case, would undermine your brain.
  You may be inclined at times under any undue stress or excitement to become mentally unbalanced.
  It remains to yourself whether you are ill or well, it will depend on the amount of self-control you develop.`,
  
  
      importantNumbers: `The numbers of "fours" and "eights" will have a very important signification for you, also the number, "nine", and such dates in any month as the 4th, 8th, 9th, 13th, 17th, 18th, 22nd, 26th, 27th and 31st.
  I do not advise you to select the series of the "fours" or the "eight", as dates on which to make engagements or carry your plans into effect.
  You should just watch them carefully as they come into your life or career.`,
  
  
     colors: `You should avoid dark sombre colours, which you will, however, be very much disposed to wear.
  On the contrary it would be better for you to dress in light colours with some touch of red, crimson or rose.`,
  
  
      jewels: `Your "lucky" jewels are best under the Mars influence, such as rubies, garnets, bloodstones and all red or reddish stones.`,
  
  
       climactericYears: `The climacteric or fadic years in your life will be the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 53rd, 58th, 62nd, 67th, 71st, 76th and 80th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "four" and "eight", such as people born on the 4th, 8th, 13th, 17th, 22nd, 26th and 31st in any month of the year, also those born in the series of the "one" the 1st, 10th, 19th and 28th.`
     },
  
  
     9: {
      character: `Persons Born on November 9th, 18th, 27th Number 9 People in This Month If you were born on any of the above dates in November, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars in the Zodiacal Sign of Scorpio, Second House of the Triplicity of Water, and in itself the House of Mars, (Negative).
  If, however, you were born on November 27, you are already far advanced in the "cusp" of the incoming Sign of Sagittarius, the House of Jupiter, positive, producing a very different effect on your life and career.
  Born on any of these dates, the basic foundation of your character and disposition is described in preceding pages for persons born in November.
  Those born on the 27th of October and the 9th or 18th of November, come under the influence of what is called "a double Mars" but at the same time it must be kept in mind that with Mars in Scorpio in this part of the Zodiac it is in the Second House of the Triplicity of Water.
  As the qualities of Mars are symbolized by fire, one can perceive at once what an extraordinary meaning is attached to "a double Mars" in this period of the Zodiac.
  The first of these "number nines," or Mars in Scorpio, commences on October 27th, the day on which President Theodore Roosevelt was born.
  Without going into any lengthy description of this leader's character, everyone knows what a mental fighter this man was.
  As Governor of New York he fought against every opposition to put down vice and corruption.
  Later he organized "Roosevelt's Rough Riders" in the Spanish-American War, and later still as President of the United States, he was "the strong man" of his age.
  As all "Mars men," if they rise to any important position, rarely escape attempts against their lives, he was no exception to this rule, as when on October 14, 1912, he was wounded in an anarchist's attempt to assassinate him.
  As President Theodore Roosevelt was born on October 27th, he came under "the double Mars" in the Sign of Scorpio, as do all persons born on the 27th of October or on the 9th, or 18th of November.
  The 27th would not be a "double Mars" as it would be Mars in Sagittarius (House of Jupiter).
  The "double Mars" also occurs in the Sign of Aries, the House of Mars positive, and affects "number nine" persons born in that Sign, namely March 27th, April 9th and 18th.
  This is a powerful influence for soldiers and those in active fighting services.
  President Ulysses Grant, the 18th President of the United States and Commander in Chief of the American Army in the Civil War, is a good example of the influence of Mars positive, having been born on the 27th of April the first "number nine" at the commencement of the Sign of Taurus, the Bull.
  If you were born on any one of these dates, you will have great executive power and organizing ability.
  You will be positive and determined, excellent in government work and administration.
  In private life you would excel as a surgeon or in any profession where cutting tools or instruments could be employed; also in engineering or construction work, or in position of authority in business enterprises.
  You will make many enemies in your course through life by your independence of character, strong will and forcefulness, but in every case persons who represent the "number nine" in November become eminently successful in whatever their work may be.
  The 27th of November coming as it does under the influence of Jupiter is equally powerful.`,
  
  
     finance: `Finance: As a rule will be successful in whatever you undertake, after a hard uphill fight in your early years; but you may expect to overcome all obstacles and difficulties and gain money and position.`,
  
  
       health: `Health: If born on the 9th, 18th or 27th of November you will be liable to fevers of all kinds, high blood pressure and over-strain of the heart.
  You will meet with many accidents, chiefly those caused by machines, also from fire-arms.
  You will be likely to meet with violence and have a sudden ending to your life, but this latter may occur from heart disease or pressure of blood on the brain.`,
  
  
       importantNumbers: `Your most important numbers will come under the series of "nine", and your important dates in any month are the 9th, 18th and 27th.
  If you were born on November 27th at the commencement of the incoming Sign of Sagittarius, you will be more fortunate during the earlier years of your life and for this reason you should try and make careful provision for your advanced years.
  In this case your more fortunate numbers are the series of the "three" and "nine".`,
  
  
       colors: `To increase your magnetic vibrations you should wear in some part of your clothing a touch of crimson, red or rose; if a woman, dresses or hats of these colours.
  If born on November 27th, your colours will be mauves, violet and purple-violet, as well as reds, crimson and rose.`,
      jewels: `Your "lucky" jewels are rubies, garnets and all red stones.`,
  
  
      climactericYears: `Your most important or climacteric years of your life are the 9th, 18th, 27th, 36th, 45th, 54th, 63rd and 72nd.`,
  
  
      magneticAttraction: `You will be much attracted to persons born on the series of the "nine", such as the 9th, 18th, 27th of any month of the year.
  If born on November 27th, you will be much attracted to persons born on the series of "three," as well as the "nine", in any month of the year.`
           }
       }
   },
    december: {
     generalInfluence: `The zodiacal influence for the month of December in general.
  Its effect on the character, disposition, finance and health of persons born in this period of the year.
  The Zodiacal Sign of Sagittarius commences on November 21st, but for seven days, being overlapped by the "cusp" of the previous sign, it does not come into its strength until on or about November 28th.
  From this date onwards it is in full power until December 20th, it is then for seven days gradually losing its force on account of becoming overlapped by the incoming Sign of Capricorn.
  This Sign of Sagittarius is represented in symbolism either by the figure of an archer or by a half-horse half-man, the man part shooting an arrow from a bow.`,
  
  
    generalCharacter: `People born in this part of the year, namely from November 21st to December 20th, and in the "cusp" to December 27th, have the characteristics of their symbol, the Archer.
  They fly direct to the target in all they undertake.
  They are inclined to be decisive and outspoken in their words and in consequence often make bitter and unforgiving enemies.
  They concentrate all their attention on whatever they are doing at the moment, and see no other way but theirs until their effort is spent.
  Their minds are so quick in thought that they will often be found breaking in on the conversation of others and show their impatience with slow or ponderous speakers.
  Brutally truthful, they unmask any attempt to deceive others, even when such action is against their own interests.
  They never stop in whatever their task may be until they wear themselves out or "die in harness." They have great enterprise in business or anything they undertake but they never feel themselves confined to any one line of work.
  For this reason they change rapidly in their views.
  As politicians they will make many changes in their policies in the course of their career; as clergymen they are likely to alter their views on religion; if scientists they often abandon their profession for some branch of industry, and so on.
  They are inclined to go to extremes in all things, make sudden decisions for which they may have regrets, but they will be too proud to acknowledge their errors.
  Love of power is their dominating quality.
  If, however, they realize that they cannot attain what they have set their heart on, they are likely to stop in the middle of their career, throw their ambition overboard and start something entirely different, or do nothing more for the rest of their lives.
  The men and women of this Sign generally marry on the impulse of the moment and regret it later.
  They are, however, too proud to acknowledge their mistakes and often pass for models of marital happiness.
  They are staunch upholders of "law and order" and are regular attendants at places of worship, more from the stand-point that their example is of benefit to others, than because "public idols" and have fame and position thrust upon them.
  The women of this Sign are as a rule the nobler of the two sexes; they do all they can to make their husbands or their children successful and are willing to sacrifice themselves to that end.
  They have an intense love of their home and even when unhappily married, they try to make the best of a bad bargain.
  They have a high sense of honour and duty, but are very independent in their outlook on life.
  Persons born in this part of the year are inclined to suffer acutely from "nerves." As they advance in years they are liable to severe attacks of sciatica and, if born towards the latter part of the month, they are liable to have some form of paralysis of the legs.
  They are also likely to have trouble with the sinus cavities of the face, also mastoids.
  This part of the year, from November 21st to December 20th-27th, is governed by Jupiter (Positive), which brings to the front all the ambitious desires of the individual born in this Sign.
  The Jupiterian influence brought to bear upon the nature by the position of the Sun in Sagittarius at their birth, renders the disposition somewhat dualistic.
  They can be sensitive, impressionable and reticent, and the next moment confident, impulsive and daring.
  Above all, they are governed by an untiring mental activity, which never flags while there remains a mystery whose secret nature has not been investigated.
  A champion of truth, peace and justice, they always find their true vocation in the service of those who suffer.
  Their sympathies are strongly with the afflicted and oppressed, and at some time in their life they usually distinguish themselves through some humanitarian or reform work for the good of others.
  They possess a keen sense of humour and dearly love an argument; in fact, they are preeminent among their friends for their exceptional skill in debate.
  Fond of fresh air and all outdoor pastimes, they are in their element when exploring or tramping over wild, rough mountainous country.
  In disposition they are frank, open and very generous; their manner is usually courteous, but when crossed they become rather brusque and defiant.
  They are highly intuitional, and show a predilection for occult and psychic matters; they are honourable to a fault, intensely truthful, resenting deception so much that they often unmask it even at the cost of their own interest.
  If anything, they are rather too decisive and outspoken, so much so that they often collide with the opinions and prejudices of those about them.
  Constant advantage is usually taken of their generosity, people try to deceive them and obtain their sympathy with plausible tales of misrepresentation.
  They are fond of music and literature and possess much ability in these directions.
  Religious leanings are indicated, but their views are heterodox and subject to change at any given moment, yet in apparently strange contradiction, they have a profound veneration for law and order.
  The temperament is essentially optimistic and the keynote to their character is compassion and sympathy in all cases of suffering.`,
  
  
    generalFinance: `Finance: Persons born in this period of the Zodiac have the greatest chance of making money from the work of their brains.
  They have much originality of ideas and should follow their own intuitions in everything they do.
  They seldom do so well with partners and associates, but are much loved by employees, servants and those under their authority.
  They often gain through legacies and gifts, but as a general rule they do not accumulate much wealth.
  If they do, for some mysterious reason it is usually taken away from them in their advanced years or at least considerably depleted.`,
  
  
    generalHealth: `Health: The Jupiterian influence on the lives of people born in this period of the year, promises that the only dangers which threaten their health arise from overactivity of mind and body.
  They are inclined to have too many schemes and projects on hand to attend to all of them satisfactorily, and in consequence there is a continuous depletion of the life forces through unnecessary scattering of energy.
  They are also rather careless in the matter of over-heating and exposure to cold, and on this account, they often suffer at some time in their lives with acute bronchitis, but the aspects are on the whole favourable in this respect and show speedy recoveries.
  Illnesses will generally arise through surfeit and the conditions of the blood and liver.
  They could escape liability to such things by a study of temperance in their mode of living.
  They should keep the blood pure, avoid drugs and live hygienically.
  They should give their mind more rest and practice the art of relaxation as much as possible.`,
  
  
    generalMarriage: `Marriages, Unions, Partnership, etc.: Those born in this part of the year will find their most harmonious relationships with persons born in their own Sign Sagittarius, Third House of the Fire Triplicity.
  July 21st to August 20th, the Sign of Leo, Second House of the Triplicity of Fire.
  March 21st to April 19th, the Sign of Aries, First House of the Triplicity of fire, and in the seven days of the "cusp" at the beginning and ending of each of these periods.
  They will also be much influenced by persons born in the month opposite their own, in this case from about May 21st to June 20th-27th.`,
  
  
    numbers: {
     1: {
       character: `Persons Born on November 28th and December 1st , 10th , 19th Number 1 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  The reason that November 28th comes into the "December zone" is, that the Sign of Sagittarius has already commenced and the 28th of November is the first "Number One" in that Sign.
  Persons born on the above dates are classed as "Number One" people.
  They are endowed with sunny, happy, hopeful dispositions; no difficulties seem to dampen their ardour; they are optimists in the highest sense of the word.
  They are generous even in their thoughts to others.
  Although outspoken and frank in their expressions.
  They are extremely enterprising and courageous; if baffled in one direction they will try another and again another, until they finally succeed.
  They give willingly of whatever they have and are inclined to impoverish themselves in their desire to be helpful to those less fortunate.
  At the same time they are rarely deceived; they seem to know intuitively the people who want "to take them in"; they never show malice and are likely to stretch out a helping hand even to persons who have tried to trick them.
  They have enormous energy in any work they are engaged in and do not spare themselves in any way.
  They dislike to be under a master and for that very reason they generally rise to be their own.
  They have a large amount of ambition, but keep it well under control.
  They never ask for the impossible or "cry for the moon".
  They are extremely honourable and make no debts they cannot pay.
  At heart, they have a deep respect for law and order and in any community of which they are part they may be relied on to assist constituted authority in the discharge of its duty.
  They love outdoor sports and generally excel in such things.
  As the Zodiacal symbol of their Sign is half-horse half-man, they possess strong animal desires, but as a rule hold them well under mental control.
  They have a deep respect for science, philosophy and religion, often making excellent preachers or ministers, but free from cant and hypocrisy.
  They love to listen to good speakers, have a great desire to express their own thoughts, but on account of being extremely sensitive their eloquence only comes when they feel they have a message to deliver-but anything they do or say goes direct, like an arrow to its mark.`,
  
  
      finance: `Finance: Persons born in the Sign of Sagittarius always make money in whatever work they are engaged in, but they are inclined to take risks and at times lose heavily by speculations.
  If they lose they are never down-hearted or blame others for their losses; they just fall back on their work or profession and build up their bank balance again.`,
      health: `Health: Persons born on the dates mentioned in Sagittarius, are blessed with splendid constitutions; their only danger is from a nervous breakdown caused by overwork.`,
  
  
       importantNumbers: `If you were born on any of these mentioned dates, the most important numbers influencing your life are the "ones" and "threes".
  The dates in any month of the year on which you should try to make your plans or engagements are the 1st, 3rd, 10th, 12th, 19th, 21st, 28th and 30th.`,
  
  
      colors: `In order to increase your magnetic vibrations, you should wear in some part of your dress the colours of our principal planets, which are: The Sun: All shades of gold, yellow, bronze to golden brown.
  Jupiter: All shades of mauve, violet or violet- purple.`,
  
  
     jewels: `Your "lucky" jewels are diamonds, topaz, amber and amethysts.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 1st, 3rd, 10th, 12th, 19th, 21st, 28th, 30th, 37th, 39th, 46th, 48th, 54th, 57th, 64th, 66th, 73rd and 75th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "one" and the "three", such as those born on the 1st, 3rd, 10th, 12th, 19th, 21st, 28th and 30th in any month of the year.`
     },
  
  
     2: {
     character: `Persons Born on December 2nd , 11th , 20th , 29th Number 2 People in This Month If you were born on any of the above dates you come under the classification of a "Number Two" person.
  Following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you respond to the vibrations of the Moon, Neptune and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of our character and disposition is described in preceding pages for persons born in December.
  As December 29th has passed beyond Sagittarius and has entered the incoming Sign of Capricorn, its characteristics are different from those given to the 2nd, 11th and 20th of December, and will be explained later.
  Persons born on the 2nd of this month being more definitely under the influence of the Moon and Neptune, as a rule do not possess the forceful determined qualities of the "number one" persons previously described born under the influence of the Sun and Uranus.
  They will be more gentle, less optimistic and less self- confident.
  They will live more on the spiritual plane of thought than the material.
  At the same time they will be endowed with mental gifts of a very high order.
  They will have a trend towards the study of philosophy, religion, mysticism and occultism.
  They often have vivid dreams and visions, together with a gift of prophecy, or at least an intuitive sense of how things are likely to turn out.
  They are as a rule, however, too sensitive to make much material use of their talents, unless they meet people extremely sympathetic to their point of view.
  They appear to be natural teachers and would make a success of such a calling, or as followers of abstruse scientific subjects.
  They are great lovers of nature and have a longing to travel and see her wonders in far off countries.
  They are refined in their tastes and faddists in regard to food.
  Naturally highly-strung and artistic, beautiful things appeal to them very strongly, such as works of art, music, painting, poetry and high class literature and eloquence.
  They care very little whether they are rich or poor, they have wealth within themselves and are usually happy and contented with their own lot.
  Those born on the 11th and 20th are more positive and determined in their thoughts and actions.
  If you were born on December 29th you will be a "number two" person in Capricorn, House of the Saturn (Positive).
  This gives a more solid plodding disposition, willing to take on heavy responsibility for others.
  The Right Honourable W.E.
  Gladstone, one of England's greatest statesmen born on December 29th, is a good example of a "number two" person born in this part of the year.`,
  
  
      finance: `Finance: In the gaining of money persons born on these dates in December are more or less indifferent, but in general they rise to occupy high positions.
  For some purpose in life, or to give help to others, they may force themselves to work for gain, but they rarely do it for any real personal advantage.`,
  
  
       health: `Health: Health as a rule is not a good point in such person's lives.
  They are seldom robust or strong although they often have large frames.
  The food they eat does not appear to give them the nourishment they require and unless they live in a high and dry climate they are liable to have lung trouble and delicacy of the bronchial tubes, trouble with the throat and rheumatism in the joints.`,
  
  
      importantNumbers: `If you were born on any of the dates mentioned, your important numbers come under the series of the "twos," "threes" and "sevens".
  The best dates for you to use in any month are the 2nd, 3rd, 7th, 11th, 12th, 16th, 21st, 23rd and 29th.`,
  
  
      colors: `You should wear in some part of your dress such colours as green, white, cream, dove-grey; also delicate shades of mauve, violet or violet-purple.`,
  
  
      jewels: `Your "lucky" jewels are pearls, moonstones, moss- agate, green or grey jade; also the amethyst and all violet coloured stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 2nd, 3rd, 7th, 11th, 12th, 16th, 21st, 25th, 29th, 30th, 34th, 38th, 43rd, 47th, 48th, 52nd, 57th, 61st, 65th and 70th.`,
       magneticAttraction: `You will be attracted to people born in the series of the "two," "three" and "seven", such as those born on the 2nd, 3rd, 7th, 11th, 12th, 16th, 20th, 21st, 25th, 29th, 30th in any month of the year, also those born in the number "one" series.`
     },
  
  
     3: {
     character: `Persons Born on December 3rd , 12th , 21st , 30th Number 3 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Jupiter and the Sun in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  The 30th of December, although also a number three, being in the Sign of Capricorn, House of Saturn, (Positive), does not come under the same classification and will be explained later.
  Persons born on the 3rd, 12th or 21st of December are classed as "Number Three" people in the House of Jupiter (Positive), and consequently come under a "double Jupiter" in this month.
  This is one of the most powerful combination in the Zodiac.
  Persons born on these dates should expect to meet with considerable success in whatever their career may be, and start out as leaders in whatever community they may happen to belong.
  Among other things, they make splendid organizers, especially in political movements, they generally receive honours, awards and high positions of responsibility in the course of their lives.
  They also make excellent contractors, builders and designers of railways, transport, shipping, or as heads of industrial concerns.
  If induced to go into any form of government life, they rise to hold distinguished positions but of great responsibility.
  Some of those born on the above dates have a mystical side to their nature and a strong religious undertone, or they may be the very reverse and become antagonistic to all forms of creeds.
  They are all great believers in the power of the pen and often establish newspapers and high-class periodicals, or issue some form of printed propaganda to advocate their own particular views.
  In spite of their splendid abilities, in advanced years they are liable to see the fortunes they have made dissolve before their eyes, without their being able to prevent such a misfortune.`,
  
  
       finance: `Finance: I have said enough previously to show how successful such persons can be, but I must warn them, in the heyday of their prosperity, to put aside money for the change which is likely to affect them after they approach about fifty years of age.`,
  
  
       health: `Health: As a rule, these persons have splendid physical constitutions and suffer very little from illness of any kind up to the age of about sixty.
  At this date a change generally begins to show itself, and if they do not lessen their responsibilities, the nervous system will begin to break down, in many cases bringing on some form of paralysis affecting the spine, arms, hands and brain.`,
  
  
      importantNumbers: `If you were born on the 3rd, 12th or 21st of December, your important numbers come under the series of the "three", with its secondary or inter-changeable numbers of "six and nine".
  The series of 3-6-9 has been called "the spinal cord of the number system".
  Your best dates in any month to make your plans and engagements, are the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th and 30th.
  If you were born on December 30th, you come under Jupiter in Capricorn, House of Saturn (Positive), and the number, "three" and "eight" will be of more importance to you.`,
  
  
      colors: `You should wear in some part of your clothing the colours belonging to Jupiter: All shades of mauve, violet and violet- purple.
  Venus: All shades of blue, from the lightest to the darkest.
  Mars: All shades of crimson, red or rose.`,
      jewels: `Your "lucky" jewels are specially the amethyst and all purple or violet coloured stones.
  Next to these will come the turquoise, also rubies, garnet and all red stones.
  If born on December 30th you should not use the red stones, but should substitute dark sapphires in their place.`,
  
  
      climactericYears: `The most important or climacteric years in your life are 3rd, 12th, 21st, 30th, 39th, 48th, 57th, 66th and 75th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "three, six and nine", but if born on December 30th, it will be the "three" and "eight" series that will attract you the most.`
     },
  
  
     4: {
     character: `Persons Born on December 4th , 13th , 22nd , 31st Number 4 People in This Month If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Uranus, the Sun and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  The 31st of December, although also a number four, being in the Sign of Capricorn, House of Saturn (Positive), does not come under the same classification, and will be explained later.
  Persons born on the 4th, 13th or 22nd of December will find the most unexpected "twists and turns" of Fate playing upon their lives.
  As the planet Uranus with its strong subtle influence over them is called the "twin brother of Saturn" they, similar to those born under Saturn, appear to be very much "Children of Destiny".
  They are clever, highly intellectual, with remarkable mental gifts along peculiar lines of their own.
  They are endowed with wonderful imagination and often great inventiveness.
  They seem to live a life apart from others and are greatly misunderstood by the more "common herd of humanity." As a rule they are subject to the cruellest forms of calumny and appear helpless to defend themselves.
  Their minds lean towards vision, strange dreams, intuition and premonition, and sooner or later they develop a love of occult studies and read deeply on such subjects.
  Persons born on the dates mentioned are extremely independent in character and crave liberty of thought and action.
  They live more or less unconventional lives, and cannot put up with any form of restraint or censure.
  Perhaps for this reason they are seldom successful in married life and generally have disagreements with their partners.
  They are seldom free from risks and dangers and have many accidents from fires, motorcars, run away horses, etc.
  they should never go in for travel by air; if they do they will be liable sooner or later to meet with disaster.
  They appear to attract opposition and trouble from religious communities or secret societies and would do well never to become affiliated with such bodies.
  From a material standpoint they often make money by their brains or in literary work of some unusual kind, also in music and painting; but they seldom can keep money or accumulate it.
  Although extremely broadminded and generous, they are strong in their likes and dislikes, which they are rarely able to control.`,
  
  
       finance: `Finance: This is a very uncertain point for persons born on the dates mentioned.
  Money may come to them in fits and starts, or in peculiar ways.
  They seldom can keep it for long, but they have a philosophical way of looking at life--that something will always turn up to help them—and strange to say it generally does.`,
       health: `Health: There are two classes that come under this head.
  One is subject to all kinds of peculiar or mysterious illnesses that come on without the least warning.
  They often have sudden cramps in the stomach, chills with rapid rise of temperature and delicacy of the lungs, throat, nasal passage, also sinus trouble.
  The other class although never really robust, get through life without any serious illness, except those caused by accidents.`,
  
  
       importantNumbers: `If you were born on the 4th, 13th, or 22nd of December, your important numbers will come under the series of the "fours" and "eights", and dates in any month such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.
  I would, however, advise you not to select these dates for any work coming from yourself.
  I would advise you to choose dates from the series of the one and the three, such as the 1st, 3rd, 10th, 12th, 19th, 21st, 28th or 30th.`,
  
  
       colors: `The best colours for you to wear, or have some touch of in your clothing, are all shades of gold, yellow, bronze to golden brown, and mauve, violet or violet-purple.`,
  
  
     jewels: `Your "lucky" jewels are the sapphire, diamond, topaz, amber, green or yellow tinted jade.`,
  
  
      climactericYears: `The most important or climacteric years in your life, and these are outside of your control, are the 4th, 8th, 13th, 17th, 22nd, 26th, 31st, 35th, 40th, 44th, 49th, 53rd, 58th, 62nd, 67th and 71st.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "1, 3, 4 and 8", such as those born on the 1st, 3rd, 4th, 8th, 10th, 12th, 13th, 17th, 19th, 21st, 22nd, 26th, 28th, 30th and 31st in any month of the year.`
     },
  
  
     5: {
     character: `Persons Born on December 5th , 14th , 23rd Number 5 People in This Month If you were born on any of the above dates in December, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mercury and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  Persons born on the 5th, 14th or 23rd of December will find the Mercury influence playing a very important role in their lives.
  They will have unusual mental activity, will be clever, quick-witted, but rather restless mentally and physically.
  They must always be actively engaged doing somethings with either their brains or their hands.
  They are ambitious in their ideas, extremely independent and inclined to be positive in their views.
  They are also quick and impulsive in their likes and dislikes.
  At the same time, they have a splendid foundation of brain power to build on and if they will only hold their restlessness under control, they would do well in whatever they take up.
  As a general rule they are intensely fond of sport, especially horse racing or anything to do with animals.
  They are inclined to have a "speed mania" and will risk life and limb in fast motorcars or in airplanes, if circumstances permit them to use such things.
  They seldom get through their career without having a bad "smash up" and if not killed, they run the risk of being in some way badly crippled.
  If they can settle down, they are likely to do well in such things as literary work, science, medicine, law or leaders in a crisis.
  They are intensely fond of argument or debate; they can be bitterly sarcastic, but once the "battle of words" is over, they bear no animosity or grudge against their opponent.
  They have much attraction for their opposite sex.
  They generally marry well, but the later they go in for the bonds of matrimony the better chance they will have of happiness.`,
       finance: `Finance: These persons nearly always make money, but in some odd way of their own, they are often very lucky in their investments especially by following their own intuitions, but they seldom have much regard for the value of money.`,
  
  
       health: `Health: Persons born under the dates mentioned rarely suffer from any serious illness except those brought on by careless living and erratic diet.
  They appear to grudge the time to eat slowly and so bring on trouble with the digestive organs.
  They are more or less prone to a nervous twitching in the eyes and face, and stammering or a lisp in speech.`,
  
  
       importantNumbers: `If you were born on the 5th, 14th or 23rd of December, although inclined to be sceptical of the influence of anything mystical, you will find that the series of "threes" and "fives" will crop up very much in your life.
  You should use dates making these numbers as much as possible, such as the 3rd, 5th, 12th, 14th, 21st, 23rd and 30th.`,
  
  
      colors: `The best colours for you to wear will be all light shades with some touch of mauve, violet-purple.`,
  
  
       jewels: `Your "lucky" jewels are the amethyst, diamond and all glittering stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 5th, 14th, 23rd, 32nd, 41st, 50th, 59th, 68th and 77th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "three" and "five", such as those born on the 3rd, 5th, 12th, 14th, 21st, 23rd, 30th in any month of the year.`
     },
  
  
     6: {
     character: `Persons Born on December 6th , 15th , 24th Number 6 People in This Month If you were born on any of the above dates in December, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Venus and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  They basic foundation of your character and disposition is described in preceding pages for persons born in December.
  Venus in the House of the Jupiter (Positive), is a most favourable combination, these two planets being what is called "friendly" to one another.
  Persons born on the 6th, 15th or 24th of December have light hearted, happy dispositions.
  They are fond of the splendours of nature, together with beauty in all its forms.
  There is nothing mean about such people; they delight in entertaining their friends, making excellent hosts or hostesses.
  They love outdoor sports, animals of all kinds, but especially dogs and horses.
  They love horse racing and generally go in for breeding of thoroughbreds, often meeting great success and making money in such enterprises.
  They love harmony around them and nothing distresses them more than to come in contact with those who go through life with a "chip on their shoulder." Born in this Sign of Sagittarius, they usually derive an income from two sources, everything seems to run in twos for them and in their favour.
  If a woman, she is nearly certain to have two husbands and two children, persons born on these dates often marry foreigners or those born far from their own place of birth.
  All are keenly attracted to their opposite sex—if they are not lovers they are at least good comrades, and as a rule they are very honourable and loyal in all their relationships.
  They are rather inclined to be "snobbish" attracting those of high social position or influence, such as government officials, those with titles and church dignitaries.
  They are extremely fond of travelling and are likely to make life long friends while on their voyages.
  Both sexes have big ideas and generally attract the necessary wealth to carry out their plans.
  Persons in this Sign of Zodiac, born on the dates mentioned, have great respect for intellectual people.
  They draw to their homes men and women who have made a name in literature, painting, music and such things.
  Even if they do not accomplish any intellectual work themselves, they have considerable taste in such matters and fill their homes with works of art and beautiful things.`,
  
  
      finance: `Finance: Whether they try to make money or not, persons born on these dates are generally fortunate during their early years; they gain by marriages, by legacies and by gifts.
  As a general rule, however, "luck" does not remain with them for the run of their lives, it would be well for them to make provision for their advanced years.`,
  
  
      health: `Health: In matters of health, as a rule, they are equally fortunate, except when they indulge too much in good living, a weakness that they usually give in to.
  Towards the end of life they often have a tendency for cancer and tumours in the intestines and breasts.`,
  
  
       importantNumbers: `If you were born on the 6th, 15th or 24th of December, your important numbers will come from the series of "threes, sixes and nines." Your best dates to carry out your plans or engagements in any month are the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, 24th, 27th or 30th.`,
  
  
      colors: `The best colours for you to wear are all shades of mauve, violet, violet-purple, all shades of blue and all tints of crimson, red or rose.`,
  
  
      jewels: `Your "lucky" jewels are the amethyst, turquoise, rubies, garnets and red stones.`,
  
  
      climactericYears: `The most important or climacteric years of your life are the 3rd, 6th, 12th, 15th, 21st, 24th, 30th, 33rd, 39th, 42nd, 48th, 51st, 57th, 60th and 66th.`,
       magneticAttraction: `You will be attracted to people born in the series of the "three, six and nine" in any month of the year.
  You are likely at times in your life, to draw to you those born in the series of the "five", such as the 5th, 14th, 23rd, but as a rule such persons will not remain in your life for any long period and will not be so fortunate for you.`
     },
  
  
     7: {
     character: `Persons Born on December 7th , 16th , 25th Number 7 People in This Month If you were born on any of the above dates in December, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Neptune, the Moon and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  The 25th of December, being so far advanced on the "cusp" of the incoming Sign of Capricorn, House of Saturn (Positive), makes a considerable difference for those born on that date, and will be explained later.
  Neptune and the Moon are gentle and yielding in their attributes, while Jupiter in its own House of Sagittarius, is dominant, forceful, ambitious and dictatorial.
  Neptune, in this part of the Zodiac, has influence over the mental more than the physical body.
  It affects people by strange dreams, visions, inspiration and experiences of a psychic nature.
  It acts on the subconscious mind in its awakened state.
  Neptune in combination with the Moon, produces the psychic poet, painter, musician or literary worker of the spiritual plane.
  Such qualities would probably lie unused in a world of dreams if the ambitious nature of Jupiter was not called into play.
  This is where the contradiction makes itself felt.
  The dreamers under Neptune and the Moon are forced into action almost in spite of themselves.
  They hear "the call" to make the world realize the power of "mind over matter." It would be all right if they would be satisfied to stop at his point, but there is a class of individuals born under the above combination who so allow their ambition for power to over-ride all other considerations, that sooner or later they bring about their own undoing.
  The other class, those who allow the psychic and spiritual to dominate the material, have splendid inspirations and leave a name behind them for their worth and mental ability.
  Persons born on the dates mentioned, if they be poets, painters, musicians, writers or leaders, often gain prominence in the world.`,
  
  
       finance: `Finance: As a rule, financial matters are peculiar for people born on these dates, if they do make money it is seldom from any form of ordinary commercial activity.
  They are inclined to lose heavily in their investments in their advanced years, become the victims of unscrupulous company promoters, or over- reach themselves in their schemes.`,
  
  
      health: `Health: As a rule their digestion is not very good, also they are inclined to eat at irregular times and do not take enough care of the material part of their system.
  Persons born on the 7th, 16th as well as the 25th of December, are too highly strung to feel really well; they mentally exhaust themselves too much and rarely get enough of sleep and rest.`,
  
  
       importantNumbers: `If you were born on any of these mentioned dates, your important numbers are influenced by the series of "twos" and "sevens", and dates in any month of the year such as the 2nd, 7th, 11th, 16th, 20th, 25th and 29th, and you should endeavour to carry out your plans and engagements on such days.
  Persons born on December 25th, being so far advanced on the "cusp" of the incoming Sign of Capricorn, House of Saturn (Positive), as a rule have more disappointments from people to encounter, than those born on the 7th, or 16th of this month.`,
  
  
      colors: `If born on any one of these dates, such as the 7th, 16th or 25th of December, you should wear, at least in some part of your clothing, the colours of green, white cream, dove-grey and pastel shades.`,
  
  
     jewels: `Your "lucky" jewels are green jade, pearls, moonstones, amethysts and purple or violet coloured stones.`,
  
  
      climactericYears: `The most important or climacteric years in your life are the 2nd, 7th, 11th, 16th, 20th, 25th, 29th, 34th, 43rd, 47th, 52nd, 56th and 70th.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "two and seven", and at times those born in the series of the "three," such as on the 3rd, 12th, 21st and 30th in any month of the year.`
     },
  
  
     8: {
     character: `Persons Born on December 8th , 17th , 26th Number 8 People in This Month If you were born on any of the above dates in December, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Saturn and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  The 26th of December, being so far advanced on "cusp" of the incoming Sign of Capricorn, House of Saturn (Positive), does not come under the same aspects as the 8th or 17th, as is more under Saturn, especially as it is the first "Number Eight" of the incoming Sign of Capricorn which will be explained later.
  Saturn, symbolized by the "Number Eight" in Jupiter's House, Sagittarius, gives great strength and force of determination.
  There is nearly always a hard life at the commencement of the career, and great obstacles to the attainment of the ambitions.
  Persons born on the 8th, 17th or 26th of December are endowed with enormous endurance; nothing may come easily to them, but with their patient, plodding, persevering disposition, as a rule they slowly and steadily build up a solid position in whatever line of work they may be engaged in.
  They make excellent judges, lawyers or business men.
  If anything, they are too cautious especially when acting for other peoples interests.
  They are extremely conscientious in whatever they do, but if they could develop more dash and self-confidence they would do better for themselves from a material standpoint.
  If anything, they are inclined to be too reserved and secretive and too easily hurt or wounded by censure or criticism.
  When they are aroused by injustice they are fearless in denouncing it and make many bitter enemies by their unequivocal attitude.
  They can be bitingly sarcastic, which they always make use of as a weapon in debate.
  Those born in December 26th, often rise to the very highest positions and have honours showered on them, but by some carelessness in diplomacy, or some over-generous action, sooner or later they are liable to turn a fickle public against them and lose their position.
  Admiral Dewey, born on December 26th, the hero of the Spanish- American War is an example of this.
  He was loaded down by honours from his nation and given a handsome house in Washington; but when he made a present of this house to his wife he became the most criticised man in the States and his popularity turned against him.`,
  
  
      finance: `Finance: Persons born on the 8th, 17th or 26th of December accumulate money slowly but steadily.
  They have usually a drain on their resources by less successful relatives, or by family ties.
  As a rule they avoid gambles and all get-rich-quick schemes and invest their money well in solid enterprises or government securities, but in spite of their caution they often lose heavily before they come to the end of their lives.`,
      health: `Health: Persons born on the 8th, 17th and 26th of December have, in the main, good constitutions, with strong muscular development.
  They are prone, however, to suffer much internally, and often undergo very severe surgical operations.`,
  
  
       importantNumbers: `If you were born on any date such as the 8th, 17th or 26th of December, being a "Number Eight" person, the numbers that will influence your life the most will be the series of "fours" and "eights" and dates in any month such as the 4th, 8th, 13th, 17th, 22nd, 26th and 31st.
  I do not advise you to select the series of the "fours" or the "eight", as dates on which to make engagements or carry your plans into effect.
  You should just watch them carefully as they come into your life or career.`,
  
  
      colors: `You will be inclined to dress in dark colours and to wear jewels such as black pearls, black diamonds and dark purple stones.
  You should avoid dark sombre colours, which you will, however, be very much disposed to wear.
  On the contrary it would be better for you to dress in light colours with some touch of red, crimson or rose.`,
  
  
      jewels: `Your "lucky" jewels are best under the Mars influence, such as rubies, garnets, bloodstones and all red or reddish stones.`,
  
  
       climactericYears: `For your climacteric years, as you cannot alter the birth date of "eight" and its series, the most important years in your life will be the 8th, 17th, 26th, 35th, 44th, 53rd, 62nd, 71st and 80th.`,
  
  
       magneticAttraction: `You will be much attracted to persons born in the series of the "four and eight", such as those born on the 4th, 8th, 13th, 17th, 22nd, 26th and 31st in any month of the year.`
     },
     9: {
     character: `Persons Born on December 9th , 18th , 27th Number 9 People in This Month If you were born on any of the above dates in December, following the rules of Zodiacal Astrology and my system based on Chaldean Numerology, you come under the vibrations of Mars and Jupiter in the Zodiacal Sign of Sagittarius, Third House of the Triplicity of Fire.
  If born on December 27th, this date being the first "Number Nine" of Capricorn, you come under the vibrations of Mars and Saturn in the Third House of the Triplicity of Earth.
  The basic foundation of your character and disposition is described in preceding pages for persons born in December.
  These dates of December 9th, 18th and 27th under the influence of the powerful planets of Jupiter, Mars and Saturn, produce a strong personality with great ambition and determination.
  Such persons are very positive in their views and rather dictatorial in whatever line of work they carry out.
  They are especially good in a sudden call or emergency.
  They are endowed with moral and physical courage, seldom knowing what the word "fear" means.
  They love a strenuous out door life if they can take the time off from their efforts, and have great command over horses and animals in general.
  They are greatly attracted to their opposite sex; as a rule they are lucky in marriage, but more than one union may be expected.
  They are unusually fond of adventure of all kinds and make excellent explorers and pioneers.
  They are restless and have a keen desire to travel, especially in far off or unknown parts of the world.
  They are ready to take on any risk at any moment and often run through great dangers in carrying out their purpose.
  They are in a sense indifferent about money, very generous to those in trouble, giving large sums to institutions or charities if they have it-if not they give their time or the work of their brains.
  They are endowed with considerable mechanical ability and ingenuity, especially in dealing with machines made for speed.
  As a general rule they are lucky in money matters, gaining through unexpected legacies, marrying well, or by speculation.
  In some cases they accumulate much wealth, but if they do they become philanthropists.`,
  
  
      finance: `Finance: As I said before, persons born on the 9th, 18th, or 27th of December are generally lucky in money matters, gaining by unexpected legacies, marriage or speculations.
  In some cases they succeed by their daring in enterprise, or in the creation of some business from which they make a rapid "turn over" and sell out quickly.
  As a rule they do better in some class of individual mental work than in commercial pursuits.
  Those born on December 27th are the most prudent of these dates, the influence of Saturn slowing down and restricting the Mars nature, bringing heavy burdens and in a general sense, a great amount of responsibility.`,
  
  
      health: `Health: In matters of health, persons born on these dates in December are their own worst enemies; they seldom take care of themselves, but risk their health in their desire to be always doing something.
  After their eighteenth year they generally become strong and robust, but from about the fifty-fourth they usually begin to pay for the nervous strain they have lived under.
  They seldom get through the run of their life without meeting with serious accidents, generally those caused by gun-shot wounds, fires, explosions or accidents of motors, airplanes or from animals.`,
  
  
       importantNumbers: `If you were born on the 9th, 18th or the 27th of December, your most important fadic numbers come from the series of "nines" also dates in any month such as the 9th, 18th or 27th.
  On those days you should try to carry out your plans or engagements.`,
  
  
       colors: `The best colours for you to wear or have some touch of in your dress, are all shades of crimson, red or rose.`,
      jewels: `Your "lucky" Jewels are rubies, garnets and all red stones.`,
  
  
       climactericYears: `The most important or climacteric years of your life are governed by the "Number nine" and all its series, such as the 9th, 18th, 27th, 36th, 45th, 54th, 63rd, 72nd and 81st.`,
  
  
       magneticAttraction: `You will be attracted to persons born in the series of the "three", six and nine, but if born on December 27th, the dates will change to the series of the "three, eight and nine", in any month of the year.`
           }
       }
   }
  };
  
  export function resolveMonthData(monthIndex: number, psychicNumber: number = 1) {
    const keys = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const key = keys[monthIndex - 1];
    const raw = MONTHLY_CHRONICLE[key];
  
    if (!raw) {
      return {
        ready: false,
        monthName: new Date(2026, monthIndex - 1).toLocaleString('default', { month: 'long' }),
        generalInfluence: 'The Monthly Chronicle for this month is being inscribed by the Chronicler. Check back after the next celestial update.',
        monthlyCharacter: 'Character analysis for this month is currently in transit.',
        financialOutlook: 'Financial outlook data is being calculated.',
        healthCautions: 'Health caution data is being compiled.',
        luckyNumbers: '', colors: '', jewels: '', climactericYears: '', magneticAttraction: ''
      };
    }
  
    const num = raw.numbers[psychicNumber] || null;
    const monthName = new Date(2026, monthIndex - 1).toLocaleString('default', { month: 'long' });
    return {
      ready: true,
      monthName,
      generalInfluence: raw.generalInfluence,
      monthlyCharacter: [raw.generalCharacter, raw.generalMarriage, num?.character].filter(Boolean).join('\n\n'),
      financialOutlook: [raw.generalFinance, num?.finance].filter(Boolean).join('\n\n'),
      healthCautions: [raw.generalHealth, num?.health].filter(Boolean).join('\n\n'),
      luckyNumbers: num?.importantNumbers || '',
      colors: num?.colors || '',
      jewels: num?.jewels || '',
      climactericYears: num?.climactericYears || '',
      magneticAttraction: num?.magneticAttraction || ''
    };
  }