// Magazine Santé Seha — articles originaux de prévention et d'information.
// Objectif : contenu utile pour les patients + référencement naturel (SEO),
// chaque article renvoyant vers l'annuaire de la spécialité concernée.
// Production : articles rédigés/validés par des praticiens partenaires signés.

export interface Article {
  slug: string;
  title: string;
  titleAr: string;
  category: string; // libellé affiché
  categoryAr: string;
  specialtyId: string; // lien vers /annuaire/<specialtyId>
  emoji: string;
  gradient: [string, string]; // couvertures SVG génératives
  readMinutes: number;
  date: string;
  summary: string;
  summaryAr: string;
  sections: { heading: string; body: string }[];
  sectionsAr: { heading: string; body: string }[];
}

export const ARTICLES: Article[] = [
  {
    slug: "hypertension-comprendre-et-agir",
    title: "Hypertension artérielle : le tueur silencieux qui touche 1 Tunisien sur 3",
    titleAr: "ارتفاع ضغط الدم: القاتل الصامت الذي يصيب ثلث التونسيين",
    category: "Santé du cœur",
    categoryAr: "صحة القلب",
    specialtyId: "cardiologie",
    emoji: "❤️",
    gradient: ["#e11d48", "#9f1239"],
    readMinutes: 4,
    date: "2026-06-15",
    summary: "Souvent sans symptômes, l'hypertension abîme le cœur, les reins et le cerveau pendant des années. Comment la dépister et la contrôler.",
    summaryAr: "غالبًا دون أعراض، يُتلف ارتفاع الضغط القلب والكلى والدماغ لسنوات. كيف نكتشفه ونتحكم فيه.",
    sections: [
      { heading: "Pourquoi « silencieux » ?", body: "L'hypertension ne fait généralement pas mal : la plupart des personnes concernées se sentent parfaitement bien pendant des années. Pendant ce temps, la pression élevée use les artères et augmente le risque d'infarctus, d'AVC et d'insuffisance rénale. C'est pourquoi le seul moyen fiable de la découvrir est de mesurer sa tension régulièrement, dès 40 ans — ou plus tôt en cas d'antécédents familiaux, de surpoids ou de diabète." },
      { heading: "Quels chiffres surveiller ?", body: "On parle d'hypertension lorsque la tension dépasse durablement 14/9 (140/90 mmHg) au cabinet. Une seule mesure élevée ne suffit pas : le stress de la consultation peut fausser le résultat (« effet blouse blanche »). Votre médecin pourra vous demander des automesures à domicile, matin et soir pendant trois jours, pour confirmer le diagnostic." },
      { heading: "L'hygiène de vie d'abord", body: "Réduire le sel (attention au pain, aux conserves et au harissa industriel), bouger 30 minutes par jour, perdre quelques kilos si nécessaire, limiter le café et arrêter le tabac : ces mesures font baisser la tension de manière mesurable. Elles restent indispensables même lorsque des médicaments sont prescrits." },
      { heading: "Un suivi régulier, à vie", body: "Le traitement antihypertenseur ne se s'arrête jamais sans avis médical, même quand les chiffres redeviennent normaux — c'est justement le signe qu'il fonctionne. Un contrôle chez le cardiologue ou le médecin de famille tous les 3 à 6 mois permet d'ajuster le traitement, de vérifier les reins et de dépister les complications à temps." },
    ],
    sectionsAr: [
      { heading: "لماذا « صامت »؟", body: "ارتفاع ضغط الدم لا يسبب ألمًا في الغالب: معظم المصابين يشعرون بصحة جيدة لسنوات، بينما يُتلف الضغط المرتفع الشرايين ويرفع خطر الجلطة القلبية والسكتة الدماغية والقصور الكلوي. لذلك فإن الوسيلة الوحيدة الموثوقة لاكتشافه هي قياس الضغط بانتظام ابتداءً من سن الأربعين — أو قبل ذلك عند وجود سوابق عائلية أو زيادة وزن أو سكري." },
      { heading: "ما هي الأرقام المهمة؟", body: "نتحدث عن ارتفاع ضغط الدم عندما يتجاوز الضغط 14/9 (140/90) بشكل مستمر في العيادة. قياس واحد مرتفع لا يكفي: توتر الزيارة قد يزيّف النتيجة (« تأثير المئزر الأبيض »). قد يطلب منك الطبيب قياسات ذاتية في المنزل، صباحًا ومساءً لمدة ثلاثة أيام، لتأكيد التشخيص." },
      { heading: "نمط الحياة أولًا", body: "التقليل من الملح (انتبه للخبز والمعلبات والهريسة الصناعية)، والمشي 30 دقيقة يوميًا، وإنقاص بعض الكيلوغرامات عند الحاجة، والحد من القهوة، والإقلاع عن التدخين: كلها إجراءات تخفض الضغط بشكل ملموس، وتبقى ضرورية حتى مع وصف الأدوية." },
      { heading: "متابعة منتظمة مدى الحياة", body: "لا يُوقف علاج الضغط أبدًا دون رأي طبي، حتى عندما تعود الأرقام إلى المعدل الطبيعي — فذلك دليل على نجاعته. مراقبة لدى طبيب القلب أو طبيب العائلة كل 3 إلى 6 أشهر تسمح بتعديل العلاج وفحص الكلى واكتشاف المضاعفات في الوقت المناسب." },
    ],
  },
  {
    slug: "vaccination-enfant-calendrier-tunisie",
    title: "Vaccins de votre enfant : le calendrier tunisien expliqué aux parents",
    titleAr: "تلاقيح طفلك: الرزنامة التونسية مشروحة للأولياء",
    category: "Santé de l'enfant",
    categoryAr: "صحة الطفل",
    specialtyId: "pediatrie",
    emoji: "🧒",
    gradient: ["#0ea5e9", "#0369a1"],
    readMinutes: 3,
    date: "2026-06-02",
    summary: "De la naissance à l'adolescence, chaque vaccin a son moment. Ce qu'il faut savoir sur le programme national de vaccination.",
    summaryAr: "من الولادة إلى المراهقة، لكل تلقيح وقته. ما يجب معرفته عن البرنامج الوطني للتلقيح.",
    sections: [
      { heading: "Un programme national gratuit", body: "La Tunisie dispose d'un programme national de vaccination qui protège gratuitement les enfants contre des maladies graves : tuberculose, hépatite B, diphtérie, tétanos, coqueluche, polio, rougeole, rubéole… Les doses sont administrées dans les centres de santé de base et chez le pédiatre, selon un calendrier précis qui commence dès la naissance." },
      { heading: "Pourquoi respecter les dates ?", body: "Chaque rappel est calculé pour stimuler l'immunité au bon moment. Un retard de quelques jours n'est pas grave, mais des mois de retard laissent l'enfant vulnérable pendant la période où il est le plus fragile. Si vous avez manqué un rendez-vous, inutile de tout recommencer : le pédiatre reprend simplement le calendrier là où il s'est arrêté." },
      { heading: "Fièvre après le vaccin : normal ?", body: "Une fièvre modérée, une rougeur ou une petite douleur au point d'injection dans les 48 heures sont des réactions banales qui témoignent que l'immunité travaille. Du paracétamol à dose adaptée au poids suffit généralement. En revanche, une fièvre très élevée, des pleurs inhabituels prolongés ou une réaction cutanée étendue justifient d'appeler le médecin." },
      { heading: "Le carnet, un document précieux", body: "Le carnet de vaccination suit votre enfant toute sa vie : école, sport, voyages, études à l'étranger. Pensez à le numériser — vous pouvez photographier chaque page et la conserver dans votre dossier médical Seha pour l'avoir toujours sur vous et la partager avec le pédiatre." },
    ],
    sectionsAr: [
      { heading: "برنامج وطني مجاني", body: "تمتلك تونس برنامجًا وطنيًا للتلقيح يحمي الأطفال مجانًا من أمراض خطيرة: السل، التهاب الكبد ب، الخناق، الكزاز، السعال الديكي، شلل الأطفال، الحصبة والحصبة الألمانية… تُعطى الجرعات في مراكز الصحة الأساسية ولدى طبيب الأطفال وفق رزنامة دقيقة تبدأ منذ الولادة." },
      { heading: "لماذا احترام المواعيد؟", body: "كل جرعة تذكير محسوبة لتحفيز المناعة في الوقت المناسب. تأخير بضعة أيام ليس خطيرًا، لكن تأخير أشهر يترك الطفل دون حماية في الفترة التي يكون فيها أكثر هشاشة. إذا فاتكم موعد فلا داعي لإعادة كل شيء: يستأنف طبيب الأطفال الرزنامة من حيث توقفت." },
      { heading: "حمى بعد التلقيح: أمر طبيعي؟", body: "حمى معتدلة أو احمرار أو ألم بسيط في موضع الحقن خلال 48 ساعة هي ردود فعل عادية تدل على أن المناعة تعمل. يكفي عادةً باراسيتامول بجرعة مناسبة للوزن. أما الحمى الشديدة أو البكاء غير المعتاد المطوّل أو الطفح الجلدي الواسع فتستوجب الاتصال بالطبيب." },
      { heading: "الدفتر وثيقة ثمينة", body: "يرافق دفتر التلقيح طفلك طوال حياته: المدرسة، الرياضة، الأسفار، الدراسة بالخارج. فكّروا في رقمنته — يمكنكم تصوير كل صفحة وحفظها في ملفكم الطبي على صحة لتكون معكم دائمًا ولمشاركتها مع طبيب الأطفال." },
    ],
  },
  {
    slug: "anxiete-quand-consulter-psychiatre",
    title: "Anxiété : à partir de quand faut-il consulter ?",
    titleAr: "القلق: متى يجب استشارة مختص؟",
    category: "Santé mentale",
    categoryAr: "الصحة النفسية",
    specialtyId: "psychiatrie",
    emoji: "🧠",
    gradient: ["#8b5cf6", "#5b21b6"],
    readMinutes: 4,
    date: "2026-05-20",
    summary: "Stress passager ou trouble anxieux ? Les signes qui doivent alerter, et pourquoi la téléconsultation facilite le premier pas.",
    summaryAr: "توتر عابر أم اضطراب قلق؟ العلامات المنذرة، ولماذا تسهّل الاستشارة عن بُعد الخطوة الأولى.",
    sections: [
      { heading: "L'anxiété utile… et l'autre", body: "S'inquiéter avant un examen ou un entretien est normal : c'est un mécanisme d'adaptation. L'anxiété devient un problème quand elle est disproportionnée, quasi quotidienne depuis plus de six mois, et qu'elle retentit sur le sommeil, la concentration, l'appétit ou la vie sociale. Palpitations, oppression thoracique, boule dans la gorge et pensées catastrophiques qui tournent en boucle en sont les manifestations les plus fréquentes." },
      { heading: "Des solutions qui marchent", body: "Les troubles anxieux se soignent bien. Les thérapies cognitivo-comportementales (TCC) apprennent à identifier et désamorcer les pensées anxieuses ; l'activité physique régulière a un effet démontré ; et lorsque c'est nécessaire, un traitement médicamenteux encadré aide à passer un cap. La pire stratégie est l'automédication, notamment avec des calmants pris sans suivi." },
      { heading: "Le premier rendez-vous, souvent le plus dur", body: "En Tunisie, consulter « un psy » reste entouré de tabous. La téléconsultation change la donne : parler depuis chez soi, en toute confidentialité, abaisse considérablement la barrière du premier contact. De nombreux psychiatres proposent désormais ce format pour les premières évaluations comme pour le suivi." },
      { heading: "Urgence : ne restez pas seul", body: "Des idées noires ou suicidaires ne sont jamais à banaliser. Parlez-en immédiatement à un proche et consultez en urgence — SAMU au 190. Demander de l'aide n'est pas une faiblesse : c'est la décision la plus courageuse et la plus efficace." },
    ],
    sectionsAr: [
      { heading: "القلق المفيد… والآخر", body: "القلق قبل امتحان أو مقابلة أمر طبيعي: إنه آلية تكيّف. يصبح القلق مشكلة عندما يكون مبالغًا فيه وشبه يومي منذ أكثر من ستة أشهر، ويؤثر على النوم والتركيز والشهية والحياة الاجتماعية. الخفقان، ضيق الصدر، الغصة في الحلق والأفكار الكارثية المتكررة هي أكثر مظاهره شيوعًا." },
      { heading: "حلول ناجعة موجودة", body: "اضطرابات القلق تُعالج بنجاح. العلاجات السلوكية المعرفية تعلّم كيفية التعرف على الأفكار القلقة وتفكيكها؛ وللنشاط البدني المنتظم أثر مثبت؛ وعند الضرورة يساعد علاج دوائي مؤطّر على تجاوز مرحلة صعبة. أسوأ استراتيجية هي التداوي الذاتي، خاصة بالمهدئات دون متابعة." },
      { heading: "الموعد الأول هو الأصعب غالبًا", body: "في تونس، لا تزال استشارة « الطبيب النفسي » محاطة بالمحظورات. الاستشارة عن بُعد غيّرت المعادلة: التحدث من المنزل وبسرية تامة يخفّض كثيرًا حاجز الاتصال الأول. كثير من الأطباء النفسيين يقترحون اليوم هذه الصيغة للتقييم الأول وللمتابعة." },
      { heading: "حالة طارئة: لا تبقَ وحدك", body: "الأفكار السوداء أو الانتحارية لا يُستهان بها أبدًا. تحدث فورًا إلى شخص قريب واستشر بشكل عاجل — الإسعاف على الرقم 190. طلب المساعدة ليس ضعفًا: إنه القرار الأشجع والأكثر نجاعة." },
    ],
  },
  {
    slug: "acne-adolescent-adulte-traitements",
    title: "Acné : pourquoi elle revient et comment s'en débarrasser durablement",
    titleAr: "حب الشباب: لماذا يعود وكيف نتخلص منه نهائيًا",
    category: "Santé de la peau",
    categoryAr: "صحة البشرة",
    specialtyId: "dermatologie",
    emoji: "🧴",
    gradient: ["#f59e0b", "#b45309"],
    readMinutes: 3,
    date: "2026-05-08",
    summary: "Boutons qui persistent après l'adolescence, cicatrices, produits inefficaces : ce que la dermatologie propose vraiment.",
    summaryAr: "حبوب تستمر بعد المراهقة، ندوب، منتجات دون جدوى: ما الذي يقترحه طب الجلد فعلًا.",
    sections: [
      { heading: "Une maladie, pas un manque d'hygiène", body: "L'acné résulte d'un excès de sébum, d'une obstruction des pores et d'une inflammation — sous influence hormonale et génétique. Se laver le visage dix fois par jour n'y change rien, et les gommages agressifs aggravent souvent l'inflammation. À l'inverse, un nettoyage doux matin et soir et une crème hydratante non comédogène constituent la base de toute routine efficace." },
      { heading: "Les erreurs qui laissent des traces", body: "Percer les boutons, c'est transformer une lésion temporaire en cicatrice définitive ou en tache pigmentée — particulièrement visible sur les peaux méditerranéennes. L'exposition au soleil « qui assèche les boutons » est un faux ami : l'amélioration apparente de l'été est presque toujours suivie d'une poussée de rebond en automne." },
      { heading: "Quand voir un dermatologue ?", body: "Si l'acné résiste à trois mois de soins bien conduits, laisse des marques, ou pèse sur le moral, une consultation s'impose. Le dermatologue dispose d'un arsenal gradué : traitements locaux à base de rétinoïdes ou de peroxyde de benzoyle, antibiotiques courts, traitement hormonal chez la femme, et isotrétinoïne pour les formes sévères — sous surveillance stricte." },
    ],
    sectionsAr: [
      { heading: "مرض، وليس نقص نظافة", body: "ينتج حب الشباب عن إفراز زائد للدهون وانسداد المسام والتهاب — تحت تأثير هرموني ووراثي. غسل الوجه عشر مرات يوميًا لا يغيّر شيئًا، والتقشير العنيف يزيد الالتهاب سوءًا غالبًا. في المقابل، تنظيف لطيف صباحًا ومساءً وكريم مرطّب لا يسد المسام هما أساس كل روتين ناجع." },
      { heading: "أخطاء تترك آثارًا", body: "الضغط على الحبوب يحوّل آفة مؤقتة إلى ندبة دائمة أو بقعة داكنة — تظهر بوضوح خاصة على البشرة المتوسطية. والتعرض للشمس « الذي يجفف الحبوب » صديق زائف: التحسّن الظاهري في الصيف يتبعه دائمًا تقريبًا انتكاس في الخريف." },
      { heading: "متى نستشير طبيب الجلد؟", body: "إذا قاوم حب الشباب ثلاثة أشهر من العناية الجيدة، أو ترك آثارًا، أو أثّر على المعنويات، فالاستشارة ضرورية. يمتلك طبيب الجلد ترسانة متدرجة: علاجات موضعية بالريتينويدات أو بيروكسيد البنزويل، مضادات حيوية قصيرة، علاج هرموني عند المرأة، والإيزوتريتينوين للحالات الشديدة — تحت مراقبة صارمة." },
    ],
  },
  {
    slug: "diabete-type-2-prevention-depistage",
    title: "Diabète de type 2 : le dépister avant les complications",
    titleAr: "السكري من النوع الثاني: اكتشافه قبل المضاعفات",
    category: "Santé générale",
    categoryAr: "الصحة العامة",
    specialtyId: "medecine-generale",
    emoji: "🩺",
    gradient: ["#1c4fdb", "#1a40b8"],
    readMinutes: 4,
    date: "2026-04-25",
    summary: "La Tunisie compte parmi les pays les plus touchés par le diabète. Une simple prise de sang peut changer la suite.",
    summaryAr: "تونس من أكثر البلدان تضررًا من السكري. تحليل دم بسيط يمكن أن يغيّر كل شيء.",
    sections: [
      { heading: "Un enjeu national", body: "Le diabète de type 2 progresse rapidement en Tunisie, porté par la sédentarité, l'alimentation riche en sucres rapides et le surpoids. Sa particularité : il évolue en silence pendant des années. Soif inhabituelle, envie fréquente d'uriner, fatigue et infections à répétition n'apparaissent souvent que tardivement, quand la glycémie est déjà très élevée." },
      { heading: "Qui doit se faire dépister ?", body: "Une glycémie à jeun est recommandée régulièrement à partir de 45 ans, et plus tôt en cas de surpoids, d'antécédent familial de diabète, d'hypertension ou de diabète pendant une grossesse. Le test se fait dans n'importe quel laboratoire d'analyses ; le résultat s'interprète avec votre médecin, car une valeur limite (« prédiabète ») est justement la meilleure fenêtre pour agir." },
      { heading: "Le prédiabète se rattrape", body: "Au stade de prédiabète, perdre 5 à 7 % de son poids et marcher 30 minutes par jour réduit de moitié le risque d'évoluer vers un diabète installé. C'est l'intervention médicale la plus rentable qui existe — elle ne coûte rien et n'a que des effets secondaires positifs." },
      { heading: "Vivre avec, sans complications", body: "Un diabète bien suivi est compatible avec une vie parfaitement normale. La clé : un suivi régulier (hémoglobine glyquée tous les 3 mois, fond d'œil et bilan rénal annuels, examen des pieds), l'observance du traitement et un médecin de famille qui coordonne le tout. Le suivi CNAM (APCI) prend en charge l'essentiel des soins liés au diabète." },
    ],
    sectionsAr: [
      { heading: "قضية وطنية", body: "ينتشر السكري من النوع الثاني بسرعة في تونس، مدفوعًا بقلة الحركة والتغذية الغنية بالسكريات السريعة وزيادة الوزن. خصوصيته أنه يتطور في صمت لسنوات: العطش غير المعتاد وكثرة التبول والتعب والالتهابات المتكررة لا تظهر غالبًا إلا متأخرة، عندما يكون سكر الدم مرتفعًا جدًا." },
      { heading: "من يجب أن يُجري الفحص؟", body: "يُنصح بتحليل سكر الدم على الريق بانتظام ابتداءً من سن 45، وقبل ذلك عند زيادة الوزن أو وجود سكري في العائلة أو ارتفاع ضغط أو سكري أثناء حمل سابق. يُجرى التحليل في أي مخبر، وتُفسَّر النتيجة مع طبيبك — فالقيمة الحدّية (« ما قبل السكري ») هي بالضبط أفضل فرصة للتحرك." },
      { heading: "ما قبل السكري يمكن تداركه", body: "في مرحلة ما قبل السكري، إنقاص 5 إلى 7٪ من الوزن والمشي 30 دقيقة يوميًا يخفّضان إلى النصف خطر التحول إلى سكري مؤكد. إنه التدخل الطبي الأكثر مردودية على الإطلاق — لا يكلف شيئًا وليست له سوى آثار جانبية إيجابية." },
      { heading: "التعايش معه دون مضاعفات", body: "السكري المتابَع جيدًا يتوافق مع حياة طبيعية تمامًا. المفتاح: متابعة منتظمة (الهيموغلوبين السكري كل 3 أشهر، فحص قاع العين والكلى سنويًا، فحص القدمين)، والالتزام بالعلاج، وطبيب عائلة ينسّق كل ذلك. نظام CNAM (الأمراض المزمنة APCI) يغطي أساسيات العلاج المرتبط بالسكري." },
    ],
  },
  {
    slug: "otite-enfant-signes-conduite",
    title: "Otites à répétition chez l'enfant : que faire ?",
    titleAr: "التهابات الأذن المتكررة عند الطفل: ماذا نفعل؟",
    category: "Santé ORL",
    categoryAr: "صحة الأنف والأذن والحنجرة",
    specialtyId: "orl",
    emoji: "👂",
    gradient: ["#6366f1", "#3730a3"],
    readMinutes: 3,
    date: "2026-04-10",
    summary: "Douleur d'oreille, fièvre, enfant qui se touche l'oreille : reconnaître l'otite et savoir quand l'ORL devient nécessaire.",
    summaryAr: "ألم الأذن، حمى، طفل يلمس أذنه: كيف نتعرف على الالتهاب ومتى يصبح أخصائي الأنف والأذن ضروريًا.",
    sections: [
      { heading: "Pourquoi les enfants surtout ?", body: "Chez le jeune enfant, la trompe d'Eustache — le petit conduit qui relie l'oreille moyenne au nez — est courte et horizontale : les microbes du rhume y remontent facilement. C'est pourquoi la plupart des otites surviennent entre 6 mois et 3 ans, souvent dans la foulée d'une rhinopharyngite banale de crèche ou de jardin d'enfants." },
      { heading: "Les signes qui doivent alerter", body: "Un enfant qui pleure en se touchant l'oreille, dort mal, a de la fièvre ou entend moins bien mérite un examen des tympans. Chez le nourrisson, l'otite peut se manifester uniquement par de l'irritabilité, un refus de téter ou des troubles digestifs. Un écoulement de liquide par l'oreille impose une consultation rapide." },
      { heading: "Quand consulter l'ORL ?", body: "Le médecin de famille ou le pédiatre traite la plupart des otites. L'avis ORL devient utile quand elles se répètent (plus de 3 ou 4 par an), quand du liquide persiste derrière le tympan plus de trois mois (otite séreuse), ou quand l'audition semble baisser — car une oreille qui entend mal à 2 ans peut retarder le langage. L'ORL évaluera alors l'intérêt d'aérateurs trans-tympaniques (« yoyos ») ou de l'ablation des végétations." },
    ],
    sectionsAr: [
      { heading: "لماذا الأطفال بالذات؟", body: "عند الطفل الصغير، تكون قناة أوستاش — القناة الصغيرة الرابطة بين الأذن الوسطى والأنف — قصيرة وأفقية، فتصعد إليها جراثيم الزكام بسهولة. لذلك تحدث معظم التهابات الأذن بين 6 أشهر و3 سنوات، غالبًا عقب زكام عادي في الحضانة أو رياض الأطفال." },
      { heading: "علامات يجب الانتباه إليها", body: "طفل يبكي ويلمس أذنه، ينام بشكل سيئ، لديه حمى أو يسمع أقل من المعتاد، يستحق فحص طبلة الأذن. عند الرضيع قد يظهر الالتهاب فقط في شكل انفعال أو رفض الرضاعة أو اضطرابات هضمية. سيلان سائل من الأذن يستوجب استشارة سريعة." },
      { heading: "متى نستشير أخصائي الأنف والأذن؟", body: "يعالج طبيب العائلة أو طبيب الأطفال معظم الالتهابات. يصبح رأي الأخصائي مفيدًا عند تكررها (أكثر من 3 أو 4 في السنة)، أو عند بقاء سائل خلف الطبلة أكثر من ثلاثة أشهر، أو عندما يبدو السمع متراجعًا — فأذن تسمع بشكل سيئ في سن الثانية قد تؤخر الكلام. سيقيّم الأخصائي حينها جدوى أنابيب التهوية أو استئصال اللحميات." },
    ],
  },
  {
    slug: "ecrans-fatigue-visuelle-enfants-adultes",
    title: "Écrans et yeux : protéger sa vision à l'ère du smartphone",
    titleAr: "الشاشات والعيون: حماية البصر في عصر الهاتف الذكي",
    category: "Santé des yeux",
    categoryAr: "صحة العيون",
    specialtyId: "ophtalmologie",
    emoji: "👁️",
    gradient: ["#14b8a6", "#0f766e"],
    readMinutes: 3,
    date: "2026-03-28",
    summary: "Yeux secs, vision floue en fin de journée, maux de tête : la fatigue visuelle numérique se prévient avec des gestes simples.",
    summaryAr: "جفاف العينين، رؤية ضبابية آخر النهار، صداع: إجهاد العين الرقمي يمكن الوقاية منه بعادات بسيطة.",
    sections: [
      { heading: "Ce que les écrans font vraiment", body: "Devant un écran, on cligne deux à trois fois moins des yeux : le film lacrymal s'évapore, d'où sécheresse, picotements et vision qui se trouble en fin de journée. S'y ajoute l'effort permanent de mise au point à courte distance, qui fatigue les muscles oculaires — surtout après 40 ans, quand la presbytie s'installe." },
      { heading: "La règle 20-20-20", body: "Toutes les 20 minutes, regardez à 20 pieds (6 mètres) pendant 20 secondes : cette pause relâche l'accommodation et relance le clignement. Ajoutez un écran positionné légèrement sous le niveau des yeux, une taille de texte confortable, et des larmes artificielles sans conservateur si la sécheresse persiste." },
      { heading: "Enfants : la myopie explose", body: "Le temps d'écran et le manque de lumière naturelle contribuent à l'épidémie mondiale de myopie chez l'enfant. Deux mesures protectrices sont bien documentées : au moins 1 à 2 heures par jour dehors, et pas d'écran dans la chambre le soir. Un dépistage ophtalmologique est recommandé avant l'entrée à l'école, puis à chaque signe d'appel (plisse les yeux, se rapproche du tableau, maux de tête)." },
    ],
    sectionsAr: [
      { heading: "ماذا تفعل الشاشات فعلًا؟", body: "أمام الشاشة نرمش مرتين إلى ثلاث مرات أقل: يتبخر الغشاء الدمعي فيظهر الجفاف والوخز وتشوّش الرؤية آخر النهار. يضاف إلى ذلك جهد التركيز الدائم عن قرب الذي يُتعب عضلات العين — خاصة بعد الأربعين مع بداية طول النظر الشيخوخي." },
      { heading: "قاعدة 20-20-20", body: "كل 20 دقيقة، انظر إلى مسافة 6 أمتار لمدة 20 ثانية: هذه الاستراحة ترخي عضلات التركيز وتعيد تنشيط الرمش. أضف إلى ذلك شاشة موضوعة قليلًا تحت مستوى العينين، وحجم خط مريحًا، ودموعًا اصطناعية دون مواد حافظة إذا استمر الجفاف." },
      { heading: "الأطفال: قصر النظر يتفشى", body: "وقت الشاشة ونقص الضوء الطبيعي يساهمان في الانتشار العالمي لقصر النظر عند الأطفال. إجراءان وقائيان موثّقان جيدًا: ساعة إلى ساعتين على الأقل يوميًا في الهواء الطلق، ولا شاشة في الغرفة مساءً. يُنصح بفحص عيون قبل دخول المدرسة، ثم عند كل علامة (تضييق العينين، الاقتراب من السبورة، صداع)." },
    ],
  },
  {
    slug: "reflux-gastrique-brulures-estomac",
    title: "Brûlures d'estomac : simple reflux ou signe à explorer ?",
    titleAr: "حرقة المعدة: ارتجاع بسيط أم علامة تستوجب الفحص؟",
    category: "Santé digestive",
    categoryAr: "الصحة الهضمية",
    specialtyId: "gastro",
    emoji: "🫁",
    gradient: ["#f97316", "#c2410c"],
    readMinutes: 3,
    date: "2026-03-12",
    summary: "Le reflux gastro-œsophagien touche un adulte sur cinq. Les bons réflexes, et les symptômes qui imposent une endoscopie.",
    summaryAr: "الارتجاع المعدي المريئي يصيب واحدًا من كل خمسة بالغين. العادات الصحيحة، والأعراض التي تستوجب التنظير.",
    sections: [
      { heading: "Un mécanisme simple", body: "Le reflux survient quand le « clapet » entre l'œsophage et l'estomac ferme mal : l'acide remonte, provoquant brûlures derrière le sternum et remontées acides, surtout après les repas et en position allongée. Repas copieux et tardifs, café, menthe, fritures, tabac et surpoids sont les principaux facteurs aggravants." },
      { heading: "Les gestes qui soulagent", body: "Dîner léger au moins deux à trois heures avant le coucher, surélever la tête du lit de 10-15 cm, fractionner les repas et perdre quelques kilos suffisent souvent à faire disparaître les symptômes occasionnels. Les antiacides en vente libre dépannent, mais leur usage quotidien prolongé sans avis médical masque parfois un problème qui mérite d'être exploré." },
      { heading: "Les signaux d'alarme", body: "Une difficulté à avaler, des vomissements répétés, un amaigrissement involontaire, une anémie ou des symptômes qui persistent malgré le traitement justifient une consultation de gastro-entérologie et, le plus souvent, une fibroscopie. Cet examen court et bien toléré permet de vérifier l'œsophage et l'estomac et d'écarter les complications." },
    ],
    sectionsAr: [
      { heading: "آلية بسيطة", body: "يحدث الارتجاع عندما لا يُغلق « الصمام » بين المريء والمعدة جيدًا: يصعد الحمض مسببًا حرقة خلف عظم الصدر وارتجاعات حمضية، خاصة بعد الوجبات وفي وضعية الاستلقاء. الوجبات الدسمة والمتأخرة والقهوة والنعناع والمقليات والتدخين وزيادة الوزن هي أبرز العوامل المفاقمة." },
      { heading: "عادات تخفف الأعراض", body: "عشاء خفيف قبل النوم بساعتين إلى ثلاث على الأقل، رفع رأس السرير 10-15 سم، تقسيم الوجبات وإنقاص بعض الكيلوغرامات: غالبًا ما يكفي ذلك لإزالة الأعراض العرضية. مضادات الحموضة المتاحة دون وصفة تسعف مؤقتًا، لكن استعمالها اليومي المطوّل دون رأي طبي قد يخفي مشكلة تستحق الفحص." },
      { heading: "إشارات الإنذار", body: "صعوبة البلع، القيء المتكرر، نقص الوزن غير المقصود، فقر الدم أو أعراض تستمر رغم العلاج: كلها تستوجب استشارة أخصائي الجهاز الهضمي وغالبًا تنظيرًا. هذا الفحص قصير وجيد التحمل، يسمح بفحص المريء والمعدة واستبعاد المضاعفات." },
    ],
  },
  {
    slug: "suivi-grossesse-tunisie-examens",
    title: "Suivi de grossesse : les rendez-vous à ne pas manquer",
    titleAr: "متابعة الحمل: المواعيد التي لا يجب تفويتها",
    category: "Santé de la femme",
    categoryAr: "صحة المرأة",
    specialtyId: "gynecologie",
    emoji: "🤰",
    gradient: ["#ec4899", "#9d174d"],
    readMinutes: 4,
    date: "2026-02-20",
    summary: "Du test positif à l'accouchement, un calendrier simple de consultations, d'échographies et d'analyses pour une grossesse sereine.",
    summaryAr: "من التحليل الإيجابي إلى الولادة، رزنامة بسيطة للفحوصات والموجات فوق الصوتية لحمل مطمئن.",
    sections: [
      { heading: "Le premier trimestre, fondateur", body: "Dès le test positif, une première consultation confirme la grossesse, fait le point sur les antécédents et prescrit le bilan initial : groupe sanguin, sérologies, glycémie, analyse d'urines. L'échographie du premier trimestre (idéalement entre 11 et 13 semaines) date précisément la grossesse et constitue un moment clé du dépistage." },
      { heading: "Un rythme régulier ensuite", body: "Le suivi standard comporte une consultation par mois, avec trois échographies de référence (une par trimestre). Entre 24 et 28 semaines, le dépistage du diabète gestationnel est particulièrement important en Tunisie où le terrain diabétique est fréquent. Tension, poids, mouvements du bébé et col sont surveillés à chaque visite." },
      { heading: "Les signes qui imposent de consulter vite", body: "Saignements, douleurs abdominales intenses, fièvre, maux de tête violents avec troubles visuels, diminution nette des mouvements du bébé ou perte de liquide : n'attendez pas le prochain rendez-vous. Appelez votre gynécologue ou rendez-vous à la maternité — mieux vaut dix fausses alertes qu'une vraie complication négligée." },
      { heading: "Préparer l'après", body: "Le suivi ne s'arrête pas à l'accouchement : consultation post-natale, rééducation périnéale, contraception et soutien à l'allaitement font partie du parcours. C'est aussi le moment de programmer les premières visites du nouveau-né chez le pédiatre — vous pouvez déjà les réserver en ligne." },
    ],
    sectionsAr: [
      { heading: "الثلث الأول أساسي", body: "منذ التحليل الإيجابي، تؤكد الاستشارة الأولى الحمل وتراجع السوابق وتصف الفحوصات الأولية: فصيلة الدم، التحاليل المصلية، سكر الدم، تحليل البول. الموجات فوق الصوتية للثلث الأول (بين الأسبوعين 11 و13 مثاليًا) تحدد عمر الحمل بدقة وتشكل محطة أساسية في الكشف المبكر." },
      { heading: "إيقاع منتظم بعد ذلك", body: "تشمل المتابعة العادية استشارة شهرية مع ثلاثة فحوصات بالموجات مرجعية (واحد لكل ثلث). بين الأسبوعين 24 و28، يكتسي كشف سكري الحمل أهمية خاصة في تونس حيث الاستعداد للسكري شائع. يُراقب في كل زيارة الضغط والوزن وحركات الجنين وعنق الرحم." },
      { heading: "علامات تستوجب استشارة عاجلة", body: "نزيف، آلام بطن شديدة، حمى، صداع عنيف مع اضطرابات بصرية، تراجع واضح لحركات الجنين أو نزول سائل: لا تنتظري الموعد القادم. اتصلي بطبيبتك أو توجهي إلى قسم الولادة — عشرة إنذارات كاذبة خير من مضاعفة حقيقية مهملة." },
      { heading: "التحضير لما بعد الولادة", body: "لا تتوقف المتابعة عند الولادة: استشارة ما بعد الولادة، إعادة تأهيل العجان، وسائل منع الحمل ودعم الرضاعة كلها جزء من المسار. وهو أيضًا وقت برمجة الزيارات الأولى للمولود عند طبيب الأطفال — يمكنكم حجزها من الآن عبر الإنترنت." },
    ],
  },
];

export const ARTICLE_CATEGORIES = Array.from(new Set(ARTICLES.map((a) => a.category)));

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

// L'essentiel de chaque article en darija (dialectal), pour toucher le plus
// large public du Maghreb : تونسي (tn), ليبي (ly) et جزائري (dz). Ce sont des
// résumés « à retenir » en langue parlée, complémentaires du texte en arabe
// standard ci-dessus. Traduction/relecture par des locuteurs natifs en prod.
export interface ArticleDialects {
  tn: string; // تونسي
  ly: string; // ليبي
  dz: string; // جزائري
}

export const ARTICLE_DIALECTS: Record<string, ArticleDialects> = {
  "hypertension-comprendre-et-agir": {
    tn: "ضغط الدم يجي بلا ما تحسّ بيه، وينجّم يضرّ قلبك وكلاويك على مدى سنين. قيس ضغطك بصفة منتظمة من سنّ الأربعين، نقّص في الملح، تحرّك كل نهار، وما توقّفش الدوا كان بأمر الطبيب.",
    ly: "الضغط يجي بلا علامات، وممكن يأذي قلبك وكلاويك على طول السنين. قيس ضغطك باستمرار من سنّ الأربعين، قلّل الملح، تحرّك كل يوم، وما توقّفش الدوا إلا بمشورة الطبيب.",
    dz: "الضغط يجي بلا ما تحسّ، ويقدر يضرّ قلبك وكلاويك على مرّ السنين. قيس ضغطك بصفة منتظمة من سنّ الأربعين، نقّص الملح، تحرّك كل نهار، وما توقّفش الدوا حتى يقولّك الطبيب.",
  },
  "vaccination-enfant-calendrier-tunisie": {
    tn: "التلاقيح متاع صغيرك مجّانية في مراكز الصحة، وكل تلقيح عندو وقتو. احترم المواعيد، والحمّى الخفيفة بعد التلقيح حاجة عادية. احتفظ بالدفتر وصوّرو في ملفك على صحة.",
    ly: "تطعيمات طفلك مجانية في المراكز الصحية، وكل تطعيم في وقته. احترم المواعيد، والسخانة الخفيفة بعد التطعيم شي عادي. احفظ الدفتر وصوّره في ملفك.",
    dz: "التلقيحات تاع صغيرك مجّانية في مراكز الصحة، وكل تلقيح عندو وقتو. احترم المواعيد، والسخانة الخفيفة بعد التلقيح حاجة عادية. احفظ الدفتر وصوّرو في ملفك.",
  },
  "anxiete-quand-consulter-psychiatre": {
    tn: "القلق حاجة عادية، أما كان ولّى كل نهار وأثّر على نومك وحياتك، لازم تشوف مختصّ. العلاج ينجّم يفيدك برشا، والاستشارة عن بُعد تسهّل عليك الخطوة الأولى. كان جاتك أفكار سوداء اتصل بحدّك بالـ190.",
    ly: "القلق شي عادي، لكن إذا ولّى كل يوم وأثّر على نومك وحياتك، لازم تشوف مختصّ. العلاج يفيد ياسر، والاستشارة عن بُعد تسهّل عليك أول خطوة. إذا جتك أفكار سودا اتصل حالاً بالـ190.",
    dz: "القلق حاجة عادية، بصح كي يولّي كل نهار ويأثّر على نومك وحياتك، لازم تشوف مختصّ. العلاج ينفع بزاف، والاستشارة عن بُعد تسهّل عليك أول خطوة. كي تجيك أفكار سودا اتصل دغيا بالـ190.",
  },
  "acne-adolescent-adulte-traitements": {
    tn: "حب الشباب مرض، موش نقص نظافة. ما تعصرش الحبوب باش ما تخلّيش أثر، ونظّف وجهك بلطف صباح وعشية. كان قعد أكثر من ثلاثة أشهر، شوف طبيب جلد.",
    ly: "حب الشباب مرض، مش قلة نظافة. ما تعصرش الحبوب باش ما تخلّي أثر، ونظّف وجهك بلطف صباح ومسا. إذا استمر أكثر من ثلاثة أشهر، شوف طبيب جلدية.",
    dz: "حب الشباب مرض، ماشي نقص نظافة. ما تعصرش الحبوب باش ما تخلّيش أثر، ونظّف وجهك بلطافة صباح وعشية. كي يقعد أكثر من ثلاثة أشهر، شوف طبيب الجلد.",
  },
  "diabete-type-2-prevention-depistage": {
    tn: "السكري يتقدّم بلا علامات، وتونس من أكثر البلدان مصابة بيه. تحليل دم بسيط على الريق يكشفو بكري. كان نقّصت في وزنك ومشيت كل نهار تنجّم تتفاداه، والـCNAM تغطّي علاجو في إطار الأمراض المزمنة.",
    ly: "السكري يتقدّم بلا علامات. تحليل دم بسيط على الريق يكشفه بدري. إذا خفّفت وزنك ومشيت كل يوم تقدر تتجنّبه، والمتابعة المنتظمة تحميك من المضاعفات.",
    dz: "السكري يتقدّم بلا علامات، والجزائر فيها بزاف مصابين. تحليل دم بسيط على الريق يكشفو بكري. كي تنقّص وزنك وتمشي كل نهار تقدر تتفاداه، والمتابعة المنتظمة تحميك من المضاعفات.",
  },
  "otite-enfant-signes-conduite": {
    tn: "كان صغيرك يبكي ويمسك في وذنو، عندو حمّى ولا يسمع شويّة، لازم يتفحّص. أغلب التهابات الوذن يعالجها طبيب العائلة، أما كان تكرّرت برشا ولا نقص السمع، شوف مختصّ أنف وأذن وحنجرة.",
    ly: "إذا طفلك يبكي ويمسك في وذنه، عنده سخانة أو يسمع أقل، لازم يتفحّص. أغلب التهابات الوذن يعالجها طبيب العائلة، لكن إذا تكرّرت ياسر أو نقص السمع، شوف أخصائي أنف وأذن.",
    dz: "كي صغيرك يبكي ويشدّ في ودنو، عندو السخانة ولا يسمع شويّة، لازم يتفحّص. أغلب التهابات الودن يعالجها طبيب العائلة، بصح كي يتكرّرو بزاف ولا ينقص السمع، شوف مختصّ الأنف والأذن.",
  },
  "ecrans-fatigue-visuelle-enfants-adultes": {
    tn: "الشاشة تعيّي عينيك وتخلّيهم يابسين. اعمل بقاعدة 20-20-20: كل 20 دقيقة اطّلع بعيد 20 ثانية. خلّي صغارك يلعبو برّا كل نهار وما تحطّش شاشة في الغرفة بالليل.",
    ly: "الشاشة تتعب عيونك وتخلّيها ناشفة. اعمل بقاعدة 20-20-20: كل 20 دقيقة طالع بعيد 20 ثانية. خلّي عيالك يلعبوا برّا كل يوم وما تحطّش شاشة في الغرفة بالليل.",
    dz: "الشاشة تعيّي عينيك وتخلّيهم يابسين. دير قاعدة 20-20-20: كل 20 دقيقة شوف بعيد 20 ثانية. خلّي دراريك يلعبو برّا كل نهار وما تحطّش شاشة في البيت في الليل.",
  },
  "reflux-gastrique-brulures-estomac": {
    tn: "حرقة المعدة تجي كان الحمض يطلع للمريء، خاصة بعد الماكلة الثقيلة والقهوة والدخان. تعشّى خفيف قبل ما ترقد بساعتين وارفع راس السرير. أما كان صعب عليك تبلع ولا نقص وزنك، لازم فيبروسكوبي.",
    ly: "حرقة المعدة تجي لمّا الحمض يطلع للمريء، خاصة بعد الأكل الثقيل والقهوة والدخان. تعشّى خفيف قبل ما ترقد بساعتين وارفع راس السرير. لكن إذا صعب عليك البلع أو نقص وزنك، لازم تنظير.",
    dz: "حرقة المعدة تجي كي الحمض يطلع للمريء، خاصة بعد الماكلة الثقيلة والقهوة والدخان. تعشّى خفيف قبل ما ترقد بساعتين وهزّ راس الفراش. بصح كي يصعب عليك تسرط ولا ينقص وزنك، لازم تنظير.",
  },
  "suivi-grossesse-tunisie-examens": {
    tn: "من أول ما تعرفي بالحمل، ابدي المتابعة: تحاليل، وثلاث سونارات، كل تريمستر وحدة. اختبار سكري الحمل مهم برشا في تونس. كان جاك نزيف ولا وجيعة قوية ولا نقصت حركة البيبي، اتصلي بطبيبتك دغري.",
    ly: "من أول ما تعرفي بالحمل، ابدي المتابعة: تحاليل، وثلاث سونارات، وحدة كل ثلاثة أشهر. فحص سكري الحمل مهم ياسر. إذا جاك نزيف أو وجع قوي أو نقصت حركة الطفل، اتصلي بطبيبتك حالاً.",
    dz: "من أول ما تعرفي بالحمل، ابدي المتابعة: تحاليل، وثلاث سونارات، وحدة كل ثلاثة أشهر. اختبار سكري الحمل مهم بزاف. كي يجيك نزيف ولا وجع قوي ولا تنقص حركة الطفل، اتصلي بطبيبتك دغيا.",
  },
};

export function articleDialects(slug: string): ArticleDialects | undefined {
  return ARTICLE_DIALECTS[slug];
}
