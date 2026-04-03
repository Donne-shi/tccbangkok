import { useParams } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';

const creedTexts: Record<string, { title: Record<Language, string>; desc: Record<Language, string>; zh: string[]; en: string[] }> = {
  'apostles-creed': {
    title: { en: "Apostles' Creed", zh: '使徒信经', th: 'หลักข้อเชื่อของอัครทูต' },
    desc: {
      en: "The Apostles' Creed is a statement of faith tracing back to the early Christian church, traditionally attributed to the teachings of the Apostles. It emerged as a response to heretical doctrines and serves as a summary of core Christian beliefs.",
      zh: '使徒信经是一份追溯到早期基督教会的信仰声明，传统上归因于使徒们的教导。它的出现是对异端教义的回应，是基督教核心信仰的简明总结。',
      th: 'หลักข้อเชื่อของอัครทูตเป็นคำแถลงศรัทธาที่สืบย้อนไปถึงคริสตจักรยุคแรก',
    },
    zh: [
      '1. 我信上帝，全能的父，创造天地的主。',
      '2. 我信我主耶稣基督，上帝的独生子；',
      '3. 因着圣灵感孕，从童贞女马利亚所生；',
      '4. 在本丢彼拉多手下受难，被钉在十字架上，受死，埋葬；降在阴间；',
      '5. 第三天从死里复活；',
      '6. 升天，坐在全能父上帝的右边；',
      '7. 将来必从那里降临，审判活人，死人。',
      '8. 我信圣灵；',
      '9. 我信圣而公之教会；我信圣徒相通；',
      '10. 我信罪得赦免，',
      '11. 我信身体复活；',
      '12. 我信永生。阿们。',
    ],
    en: [
      '1. I believe in God, the Father almighty, creator of heaven and earth.',
      '2. I believe in Jesus Christ, his only Son, our Lord,',
      '3. who was conceived by the Holy Spirit and born of the virgin Mary.',
      '4. He suffered under Pontius Pilate, was crucified, died, and was buried; he descended to hell.',
      '5. The third day he rose again from the dead.',
      '6. He ascended to heaven and is seated at the right hand of God the Father almighty.',
      '7. From there he will come to judge the living and the dead.',
      '8. I believe in the Holy Spirit,',
      '9. the holy catholic church, the communion of saints,',
      '10. the forgiveness of sins,',
      '11. the resurrection of the body,',
      '12. and the life everlasting. Amen.',
    ],
  },
  'nicene-creed': {
    title: { en: 'Nicene Creed', zh: '尼西亚信经', th: 'หลักข้อเชื่อไนซีน' },
    desc: {
      en: 'The Nicene Creed was formulated at the First Council of Nicaea in 325 AD, and expanded at the Council of Constantinople in 381 AD. It affirms the Trinity and the full divinity of Christ against Arianism.',
      zh: '尼西亚信经于公元325年第一次尼西亚公会议上制定，后于公元381年君士坦丁堡公会议上扩展。它确认三位一体和基督的完全神性，反对亚流主义。',
      th: 'หลักข้อเชื่อไนซีนถูกกำหนดขึ้นที่สภาไนซีนครั้งแรกในปี ค.ศ. 325',
    },
    zh: [
      '1. 我信独一上帝，全能的父，创造天、地、和有形、无形万物的主。',
      '2. 我信独一主耶稣基督，上帝的独生子，在万世以前为父所生，出于神而为神，出于光而为光，出于真神而为真神，受生而非被造，与父同一本体，万物都是借着祂造的；',
      '3. 祂为要拯救我们世人，从天降临，因着圣灵，并从童女马利亚成肉身，而为人；',
      '4. 在本丢彼拉多手下，为我们钉于十字架上，受难，埋葬；',
      '5. 照圣经第三天复活；',
      '6. 并升天，坐在父的右边；',
      '7. 将来必有荣耀再降临，审判活人死人；祂的国度永无穷尽；',
      '8. 我信圣灵，赐生命的主，从父和子出来，与父子同受敬拜，同受尊荣，祂曾借众先知说话。',
      '9. 我信独一、神圣、大公、使徒的教会；',
      '10. 我认使罪得赦的独一洗礼；',
      '11. 我望死人复活；',
      '12. 并来世生命。阿们。',
    ],
    en: [
      '1. I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.',
      '2. And in one Lord Jesus Christ, the only-begotten Son of God, begotten of the Father before all worlds; God of God, Light of Light, very God of very God; begotten, not made, being of one substance with the Father, by whom all things were made.',
      '3. Who, for us and for our salvation, came down from heaven, and was incarnate by the Holy Spirit of the virgin Mary, and was made man;',
      '4. and was crucified also for us under Pontius Pilate; He suffered and was buried;',
      '5. and the third day He rose again, according to the Scriptures;',
      '6. and ascended into heaven, and sits on the right hand of the Father;',
      '7. and He shall come again, with glory, to judge the living and the dead; whose kingdom shall have no end.',
      '8. And I believe in the Holy Spirit, the Lord and Giver of life; who proceeds from the Father and the Son; who with the Father and the Son together is worshipped and glorified; who spoke by the prophets.',
      '9. And I believe in one holy catholic and apostolic Church.',
      '10. I acknowledge one baptism for the remission of sins;',
      '11. and I look for the resurrection of the dead,',
      '12. and the life of the world to come. Amen.',
    ],
  },
  'chalcedonian-creed': {
    title: { en: 'Chalcedonian Creed', zh: '迦克敦信经', th: 'หลักข้อเชื่อคาลซีดอน' },
    desc: {
      en: 'The Chalcedonian Creed was adopted at the Fourth Ecumenical Council held at Chalcedon in 451 AD. It established the orthodox view that Christ has two natures—human and divine—united in one person without confusion, change, division, or separation.',
      zh: '迦克敦信经于公元451年在迦克敦召开的第四次大公会议上通过。它确立了正统的基督论观点：基督具有人性和神性两个本性，联合于一个位格之中，不相混乱，不相交换，不能分开，不能离散。',
      th: 'หลักข้อเชื่อคาลซีดอนได้รับการรับรองที่สภาสากลครั้งที่สี่ในปี ค.ศ. 451',
    },
    zh: [
      '我们跟随圣教父，同心合意教人宣认同一位子、我主耶稣基督，是神性完全、人性亦完全者。',
      '祂真是上帝，也真是人，具有理性的灵魂，也具有身体。',
      '按神性说，祂与父同体；按人性说，祂与我们同体，在凡事上与我们一样，只是没有罪。',
      '按神性说，在万世之前，为父所生；按人性说，在晚近时日，为求拯救我们，由上帝之母童贞女玛丽娅所生；',
      '是同一基督，是子、是主、是独生的，具有二性，不相混乱，不相交换，不能分开，不能离散。',
      '二性的区别不因联合而消失，各性的特点反得以保存，会合于一个位格、一个实质之内，而并非分离成为两个位格，却是同一位子、独生的、道上帝、主耶稣基督。',
      '正如众先知论到他自始所宣讲的，主耶稣基督自己所教训我们的，诸圣教父的信经所传给我们的。',
    ],
    en: [
      'We, then, following the holy Fathers, all with one consent, teach people to confess one and the same Son, our Lord Jesus Christ, the same perfect in Godhead and also perfect in manhood;',
      'truly God and truly man, of a reasonable soul and body;',
      'consubstantial with the Father according to the Godhead, and consubstantial with us according to the Manhood; in all things like unto us, without sin;',
      'begotten before all ages of the Father according to the Godhead, and in these latter days, for us and for our salvation, born of the Virgin Mary, the Mother of God, according to the Manhood;',
      'one and the same Christ, Son, Lord, only begotten, to be acknowledged in two natures, inconfusedly, unchangeably, indivisibly, inseparably;',
      'the distinction of natures being by no means taken away by the union, but rather the property of each nature being preserved, and concurring in one Person and one Subsistence, not parted or divided into two persons, but one and the same Son, and only begotten God, the Word, the Lord Jesus Christ;',
      'as the prophets from the beginning have declared concerning Him, and the Lord Jesus Christ Himself has taught us, and the creed of the holy Fathers has handed down to us.',
    ],
  },
  'athanasian-creed': {
    title: { en: 'Athanasian Creed', zh: '亚塔那修信经', th: 'หลักข้อเชื่ออาธานาเซียส' },
    desc: {
      en: 'The Athanasian Creed is a Christian statement of belief focused on Trinitarian doctrine and Christology. It is traditionally attributed to Athanasius of Alexandria and provides a comprehensive exposition of the orthodox understanding of the Trinity and the Incarnation.',
      zh: '亚塔那修信经是一份以三位一体教义和基督论为核心的基督教信仰声明。传统上归于亚历山大的亚塔那修，对三位一体和道成肉身的正统理解作了全面的阐述。',
      th: 'หลักข้อเชื่ออาธานาเซียสเป็นคำแถลงความเชื่อของคริสเตียนที่เน้นหลักคำสอนเรื่องตรีเอกานุภาพ',
    },
    zh: [
      '1. 人要得到上帝的拯救，最重要的是：必须要持守大公教会的信仰。',
      '2. 人必需要笃信无疑的、完整的、纯洁的持守此信仰。',
      '3. 大公教会信仰即是：我们敬拜三位一体的独一神；这独一神里的三位乃是合而为一的。',
      '4. 独一神里的三位彼此间不混乱，其本质也不分开。',
      '5. 此三位乃是：圣父、圣子、圣灵。',
      '6. 然而圣父、圣子、圣灵乃是在同一个神性本质内；祂们的荣耀及永恒中的威严也是相同的。',
      '7. 圣父是怎样的神，圣子也就是那样的神，圣灵亦是那样的神。',
      '8. 圣父并非是受造的，圣子也是如此，圣灵亦是如此。',
      '9. 圣父是无限的，圣子也是无限的，圣灵亦是无限的。',
      '10. 圣父是永恒的，圣子也是永恒的，圣灵亦是永恒的。',
      '11. 然而祂们并不是三位永恒的神，而是独一的永恒神。',
      '12. 也不是三位非受造的无限之神，而是独一的非受造的无限之神。',
      '13. 相同的，圣父是全能的，圣子也是全能的，圣灵亦是全能的。',
      '14. 然而祂们并不是三位全能的神，而是独一的全能神。',
      '15. 圣父是神，圣子也是神，圣灵亦是神。',
      '16. 然而祂们并不是三位神，而是独一的神。',
      '17. 相同的，圣父是我们的主，圣子也是我们的主，圣灵亦是我们的主。',
      '18. 然而，我们并非有三位主，而是只有独一的主。',
      '19. 因此，我们受到基督真理的催促而承认：圣父、圣子、圣灵每一位都是神、都是我们的主。',
      '20. 大公基督教也禁止我们说：有三位神、或三位主。',
      '21. 圣父并非是经由某某或某物而产生的；并非是受造的，也非被生的。',
      '22. 圣子是单单是经由圣父而产生的；但并不是被圣父所造，而是经由圣父所生出。',
      '23. 圣灵是经由圣父和圣子而产生的；但并不是被造，也不是被生出，而是从圣父和圣子而发出。',
      '24. 因此有一位圣父，而非三位圣父；有一位圣子，而非三位圣子；有一位圣灵，而非三位圣灵。',
      '25. 在此三位一体独一神中的三位之间，并无前后、尊卑、大小之分别。',
      '26. 三位乃是共同的永恒及同等。',
      '27. 因此，如前所述，这合一的三位一体神，或说是三位一体的合一神，当受我们敬拜。',
      '28. 所以人要得到上帝的拯救，必须要思想这位三位一体之神。',
      '29. 此外，要得到上帝的救恩，也必须要笃信我们主耶稣基督的道成肉身。',
      '30. 因为纯正的信仰乃是我们宣告相信：上帝的儿子，我们的主耶稣基督是神、也是人。',
      '31. 祂是神，在诸世界存在之前被圣父生出，有着圣父的本质；祂也是人，生出在这个世界之中，有着祂母亲的本质。',
      '32. 祂是完全的神，也是具有理性之灵魂及人类血肉实体之完全的人。',
      '33. 就祂的神性而论，祂与圣父同等；就祂的人性而论，祂低于圣父。',
      '34. 虽然祂同时是神、也是人，然而并非是两位，而是一位基督。',
      '35. 祂是将人性带进神之中的那一位，而不是将神性转变为血肉之躯的那一位。',
      '36. 祂完全是一位，但并非借着祂的神性和人性本质两者间互相混合成为一，而是借着位格的联合为一。',
      '37. 就如同祂的理性之灵魂和肉体之躯联合成为一位人；相同的，神和人也是联合为一位基督。',
      '38. 祂为了拯救我们而受难，并下到阴间，但在第三天从死里复活。',
      '39. 祂升到天上，坐在全能父神的右边。',
      '40. 将来要从那里降临，来审判活人和死人。',
      '41. 当祂降临时，所有的人必然会从肉身中复活。',
      '42. 所有的人必要供认他们自己所做过的事。',
      '43. 那些行善的人必要进入永生，为恶的人必要进入永火中。',
      '44. 以上乃是大公教会的信仰，除非人虔诚笃信，否则便无法得到拯救。阿们。',
    ],
    en: [
      '1. Whosoever will be saved, before all things it is necessary that he hold the catholic faith;',
      '2. Which faith except every one do keep whole and undefiled, without doubt he shall perish everlastingly.',
      '3. And the catholic faith is this: That we worship one God in Trinity, and Trinity in Unity;',
      '4. Neither confounding the persons nor dividing the substance.',
      '5. For there is one person of the Father, another of the Son, and another of the Holy Spirit.',
      '6. But the Godhead of the Father, of the Son, and of the Holy Spirit is all one, the glory equal, the majesty coeternal.',
      '7. Such as the Father is, such is the Son, and such is the Holy Spirit.',
      '8. The Father uncreated, the Son uncreated, and the Holy Spirit uncreated.',
      '9. The Father incomprehensible, the Son incomprehensible, and the Holy Spirit incomprehensible.',
      '10. The Father eternal, the Son eternal, and the Holy Spirit eternal.',
      '11. And yet they are not three eternals but one eternal.',
      '12. As also there are not three uncreated nor three incomprehensible, but one uncreated and one incomprehensible.',
      '13. So likewise the Father is almighty, the Son almighty, and the Holy Spirit almighty.',
      '14. And yet they are not three almighties, but one almighty.',
      '15. So the Father is God, the Son is God, and the Holy Spirit is God;',
      '16. And yet they are not three Gods, but one God.',
      '17. So likewise the Father is Lord, the Son Lord, and the Holy Spirit Lord;',
      '18. And yet they are not three Lords but one Lord.',
      '19. For like as we are compelled by the Christian verity to acknowledge every Person by himself to be God and Lord;',
      '20. So are we forbidden by the catholic religion to say; There are three Gods or three Lords.',
      '21. The Father is made of none, neither created nor begotten.',
      '22. The Son is of the Father alone; not made nor created, but begotten.',
      '23. The Holy Spirit is of the Father and of the Son; neither made, nor created, nor begotten, but proceeding.',
      '24. So there is one Father, not three Fathers; one Son, not three Sons; one Holy Spirit, not three Holy Spirits.',
      '25. And in this Trinity none is afore or after another; none is greater or less than another.',
      '26. But the whole three persons are coeternal, and coequal.',
      '27. So that in all things, as aforesaid, the Unity in Trinity and the Trinity in Unity is to be worshipped.',
      '28. He therefore that will be saved must thus think of the Trinity.',
      '29. Furthermore it is necessary to everlasting salvation that he also believe rightly the incarnation of our Lord Jesus Christ.',
      '30. For the right faith is that we believe and confess that our Lord Jesus Christ, the Son of God, is God and man.',
      '31. God of the substance of the Father, begotten before the worlds; and man of substance of His mother, born in the world.',
      '32. Perfect God and perfect man, of a reasonable soul and human flesh subsisting.',
      '33. Equal to the Father as touching His Godhead, and inferior to the Father as touching His manhood.',
      '34. Who, although He is God and man, yet He is not two, but one Christ.',
      '35. One, not by conversion of the Godhead into flesh, but by taking of that manhood into God.',
      '36. One altogether, not by confusion of substance, but by unity of person.',
      '37. For as the reasonable soul and flesh is one man, so God and man is one Christ;',
      '38. Who suffered for our salvation, descended into hell, rose again the third day from the dead;',
      '39. He ascended into heaven, He sits on the right hand of the Father, God, Almighty;',
      '40. From thence He shall come to judge the quick and the dead.',
      '41. At whose coming all men shall rise again with their bodies;',
      '42. and shall give account of their own works.',
      '43. And they that have done good shall go into life everlasting and they that have done evil into everlasting fire.',
      '44. This is the catholic faith, which except a man believe faithfully he cannot be saved. Amen.',
    ],
  },
};

function CreedViewContent() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  const creed = slug ? creedTexts[slug] : null;

  if (!creed) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Resource not found.</p>
      </div>
    );
  }

  const lines = language === 'en' || language === 'th' ? creed.en : creed.zh;

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          {t(creed.title, language)}
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {t(creed.desc, language)}
        </p>

        <div className="bg-card rounded-lg border border-border p-8 shadow-sm space-y-4">
          {lines.map((line, i) => (
            <p key={i} className="text-foreground leading-relaxed text-base">
              {line}
            </p>
          ))}
        </div>

        {/* Show both languages */}
        {language === 'zh' && (
          <div className="mt-8">
            <h3 className="font-heading text-lg font-semibold text-muted-foreground mb-4">English</h3>
            <div className="bg-secondary rounded-lg border border-border p-8 space-y-4">
              {creed.en.map((line, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
        {(language === 'en' || language === 'th') && (
          <div className="mt-8">
            <h3 className="font-heading text-lg font-semibold text-muted-foreground mb-4">中文</h3>
            <div className="bg-secondary rounded-lg border border-border p-8 space-y-4">
              {creed.zh.map((line, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CreedViewPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <CreedViewContent />
      </PageLayout>
    </LanguageProvider>
  );
}
