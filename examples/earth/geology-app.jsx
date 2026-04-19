import React, { useState, useEffect, useMemo } from 'react';

// ============ 节点构造器 ============
const n = (id, level, name, nameLatin, startMa, endMa, meta = {}, children = []) =>
  ({ id, level, name, nameLatin, startMa, endMa, ...meta, children });

// ============ 地质年代等级元数据 ============
const LEVEL_META = {
  eon:    { zh: '宙', latin: 'Eon',    roman: 'Ⅰ', titleSize: 88 },
  era:    { zh: '代', latin: 'Era',    roman: 'Ⅱ', titleSize: 74 },
  period: { zh: '纪', latin: 'Period', roman: 'Ⅲ', titleSize: 60 },
  epoch:  { zh: '世', latin: 'Epoch',  roman: 'Ⅳ', titleSize: 48 },
  age:    { zh: '期', latin: 'Age',    roman: 'Ⅴ', titleSize: 36 },
  chron:  { zh: '时', latin: 'Chron',  roman: 'Ⅵ', titleSize: 28 },
};
const LEVEL_ORDER = ['eon', 'era', 'period', 'epoch', 'age', 'chron'];

// ============ 地质年代树 (ICS 2023) ============
const tree = [
  // ═════════════════ 冥古宙 ═════════════════
  n('hadean', 'eon', '冥古宙', 'Hadean', 4600, 4000, {
    color: '#3d2817', stratumColor: '#4a2d1a', pattern: 'igneous', sketchId: 'hadean',
    tagline: '熔岩的年代',
    events: [
      '地球由原行星盘吸积形成，表面被岩浆海洋覆盖',
      '火星大小的忒伊亚撞击地球，飞溅物形成月球',
      '地壳开始凝固，原始海洋逐渐形成',
      '小行星晚期重轰击事件（41–38 亿年前）',
    ],
    species: '无生命迹象（理论推测化学演化起源）',
    notes: '岩石记录极少，锆石晶体是我们窥探那段时光的唯一窗口。澳大利亚杰克山的锆石记录最早可追溯到 44 亿年前。',
    temperature: '地表约 230°C（早期）',
  }),

  // ═════════════════ 太古宙 ═════════════════
  n('archean', 'eon', '太古宙', 'Archean', 4000, 2500, {
    color: '#5c3a21', stratumColor: '#6b3e1e', pattern: 'banded', sketchId: 'archean',
    tagline: '生命初现',
    events: [
      '最早的稳定大陆地壳形成（克拉通）',
      '最早的生命迹象：格陵兰伊苏阿碳同位素证据（约 38 亿年前）',
      '叠层石出现，蓝细菌开始光合作用',
      '条带状含铁建造（BIF）大量沉积',
    ],
    species: '原核生物：厌氧古菌、蓝细菌、硫细菌',
    notes: '当时大气中几乎没有游离氧。天空可能呈橙红色，海洋富含溶解铁（Fe²⁺），呈现绿色。',
    temperature: '55–85°C（平均海水温度）',
  }, [
    n('eoarchean', 'era', '始太古代', 'Eoarchean', 4000, 3600, {
      tagline: '最早的地壳',
      notes: '加拿大阿卡斯塔片麻岩（约 40.3 亿年前）是地球上最古老的完整岩石标本。',
    }),
    n('paleoarchean', 'era', '古太古代', 'Paleoarchean', 3600, 3200, {
      tagline: '原始生命的第一束光',
      notes: '西澳皮尔巴拉与南非巴伯顿绿岩带保存了最古老的叠层石和可能的微体化石。',
    }),
    n('mesoarchean', 'era', '中太古代', 'Mesoarchean', 3200, 2800, {
      tagline: '大陆核心生长',
      notes: '稳定陆核面积扩大，海洋蓝细菌开始繁盛，光合作用日益重要。',
    }),
    n('neoarchean', 'era', '新太古代', 'Neoarchean', 2800, 2500, {
      tagline: '陆核合并的序曲',
      notes: '多个陆核合并形成超大陆肯诺兰（Kenorland）。局部出现含氧微环境。',
    }),
  ]),

  // ═════════════════ 元古宙 ═════════════════
  n('proterozoic', 'eon', '元古宙', 'Proterozoic', 2500, 538.8, {
    color: '#8b4513', stratumColor: '#9c5025', pattern: 'laminated', sketchId: 'proterozoic',
    tagline: '大氧化事件与雪球地球',
    events: [
      '大氧化事件（GOE, 约 24 亿年前）：蓝细菌改造大气',
      '休伦冰期 —— 地球首次全球冰河（24–21 亿年前）',
      '真核生物出现（约 21 亿年前）',
      '新元古代雪球地球：成冰纪全球冻结（7.2–6.35 亿年前）',
      '埃迪卡拉生物群 —— 最早的复杂多细胞生命（约 5.75 亿年前）',
    ],
    species: '真核单细胞 → 多细胞藻类 → 埃迪卡拉动物群',
    notes: '雪球融化后海洋营养激增，被认为触发了寒武纪大爆发的序幕。',
    temperature: '波动剧烈（雪球期 –50°C 至间冰期 40°C）',
  }, [
    n('paleoproterozoic', 'era', '古元古代', 'Paleoproterozoic', 2500, 1600, {
      tagline: '氧气革命',
      notes: '大氧化事件改变地球大气成分，真核生物登场。哥伦比亚超大陆形成。',
    }, [
      n('siderian', 'period', '成铁纪', 'Siderian', 2500, 2300, {
        tagline: '铁的沉淀',
        notes: '条带状含铁建造（BIF）沉积的高峰，占世界铁矿资源的大部分。',
      }),
      n('rhyacian', 'period', '层侵纪', 'Rhyacian', 2300, 2050, {
        tagline: '层状侵入体',
        notes: '布什维尔德等大型层状侵入体形成。休伦冰期发生。',
      }),
      n('orosirian', 'period', '造山纪', 'Orosirian', 2050, 1800, {
        tagline: '造山运动',
        notes: '大规模造山运动塑造了古大陆骨架。氧气含量持续上升。',
      }),
      n('statherian', 'period', '固结纪', 'Statherian', 1800, 1600, {
        tagline: '大陆固结',
        notes: '哥伦比亚超大陆完全形成。大陆进入稳定期。',
      }),
    ]),
    n('mesoproterozoic', 'era', '中元古代', 'Mesoproterozoic', 1600, 1000, {
      tagline: '无聊十亿年',
      notes: '地球演化相对平静，被戏称为"无聊的十亿年"。但真核生物在此期间多样化。',
    }, [
      n('calymmian', 'period', '盖层纪', 'Calymmian', 1600, 1400, {
        tagline: '沉积盖层',
        notes: '广泛的沉积盖层覆盖在老的结晶基底之上。',
      }),
      n('ectasian', 'period', '延展纪', 'Ectasian', 1400, 1200, {
        tagline: '沉积延展',
        notes: '沉积盖层继续延展发育。多细胞红藻（本格摩亚藻）化石出现。',
      }),
      n('stenian', 'period', '狭带纪', 'Stenian', 1200, 1000, {
        tagline: '狭窄变质带',
        notes: '罗迪尼亚超大陆开始形成，沿碰撞带形成狭窄的变质岩带。',
      }),
    ]),
    n('neoproterozoic', 'era', '新元古代', 'Neoproterozoic', 1000, 538.8, {
      tagline: '雪球之后的黎明',
      notes: '从罗迪尼亚裂解，到雪球地球，再到埃迪卡拉动物群 —— 生命飞跃的序幕。',
    }, [
      n('tonian', 'period', '拉伸纪', 'Tonian', 1000, 720, {
        tagline: '罗迪尼亚裂解',
        notes: '罗迪尼亚超大陆开始拉张分裂。真核生物多样化加速。',
      }),
      n('cryogenian', 'period', '成冰纪', 'Cryogenian', 720, 635, {
        tagline: '雪球地球',
        notes: '至少两次全球性冰冻事件（斯图尔特冰期、马里诺冰期）。冰川沉积物出现在赤道。',
      }),
      n('ediacaran', 'period', '埃迪卡拉纪', 'Ediacaran', 635, 538.8, {
        tagline: '软体生命的花园',
        notes: '澳大利亚埃迪卡拉山地发现的化石群：狄更逊水母、金伯拉虫等 —— 地球上最早的大型复杂生物。',
      }),
    ]),
  ]),

  // ═════════════════ 显生宙 ═════════════════
  n('phanerozoic', 'eon', '显生宙', 'Phanerozoic', 538.8, 0, {
    color: '#7a9a5e', stratumColor: '#8fa870', pattern: 'fossil-rich', sketchId: 'cambrian',
    tagline: '可见生命的时代',
    events: [
      '寒武纪大爆发，动物门类几乎全部出现',
      '生命征服陆地、天空与海洋',
      '五次大灭绝深刻重塑生物圈',
      '人类在最末端崛起',
    ],
    species: '从三叶虫到智人 —— 所有复杂动物门类的舞台',
    notes: '"显生宙"意为"可见生命的时代"。前面 40 亿年的故事几乎只有显微镜下才能看见，而显生宙的化石随处可见，记录之丰富让地质学家得以建立精细的时间刻度。',
    temperature: '平均约 17°C（波动于 10–28°C）',
  }, [
    // ─────── 古生代 ───────
    n('paleozoic', 'era', '古生代', 'Paleozoic', 538.8, 251.902, {
      tagline: '古老生命之代',
      notes: '从海洋无脊椎动物的大爆发开始，到二叠纪末大灭绝结束。鱼类、两栖类、爬行类相继登场。',
    }, [
      // ▓▓▓ 寒武纪 ▓▓▓
      n('cambrian', 'period', '寒武纪', 'Cambrian', 538.8, 485.4, {
        color: '#7a9a5e', stratumColor: '#8fa870', pattern: 'fossil-rich', sketchId: 'cambrian',
        tagline: '生命大爆发',
        events: [
          '寒武纪大爆发：几乎所有现代动物门类集中出现',
          '硬壳生物大量出现（三叶虫、腕足动物）',
          '布尔吉斯页岩与澄江生物群留下精美软体化石',
          '最早的脊索动物（皮卡虫）出现',
        ],
        species: '三叶虫、奇虾、怪诞虫、欧巴宾海蝎、皮卡虫',
        notes: '澄江化石中连神经组织都清晰可辨。生命多样性的第一次大爆发。',
        temperature: '约 21°C',
      }, [
        n('terreneuvian', 'epoch', '纽芬兰世', 'Terreneuvian', 538.8, 521, {
          tagline: '显生宙开端',
          notes: '以遗迹化石 Treptichnus pedum 的首次出现作为显生宙的起点。小壳动物群繁盛。',
        }, [
          n('fortunian', 'age', '幸运期', 'Fortunian', 538.8, 529, {
            tagline: '显生宙第一期',
            notes: '命名自加拿大纽芬兰的 Fortune Head。',
          }),
          n('cambrian_stage_2', 'age', '寒武纪第二期', 'Cambrian Stage 2', 529, 521, {
            tagline: '待正式命名',
            notes: '暂无正式名称，小壳动物群进一步多样化。',
          }),
        ]),
        n('cambrian_series_2', 'epoch', '寒武纪第二世', 'Cambrian Series 2', 521, 509, {
          tagline: '三叶虫登场',
          notes: '三叶虫首次出现并迅速成为海洋中最显眼的动物。',
        }, [
          n('cambrian_stage_3', 'age', '寒武纪第三期', 'Cambrian Stage 3', 521, 514, {
            tagline: '三叶虫首现',
            notes: '最早的三叶虫（如莱德利基虫）出现于此期。',
          }),
          n('cambrian_stage_4', 'age', '寒武纪第四期', 'Cambrian Stage 4', 514, 509, {
            tagline: '布尔吉斯页岩动物群',
            notes: '加拿大布尔吉斯页岩保存了这一时期奇妙的软体动物化石。',
          }),
        ]),
        n('miaolingian', 'epoch', '苗岭世', 'Miaolingian', 509, 497, {
          tagline: '中寒武世',
          notes: '以中国湖南苗岭为名。三叶虫极盛时代，软体化石宝库丰富。',
        }, [
          n('wuliuan', 'age', '乌溜期', 'Wuliuan', 509, 504.5, {
            tagline: '苗岭世之始',
            notes: '以贵州剑河乌溜剖面为标准。',
          }),
          n('drumian', 'age', '鼓山期', 'Drumian', 504.5, 500.5, {
            tagline: '三叶虫辐射',
            notes: '名称源自美国犹他州德拉姆山。',
          }),
          n('guzhangian', 'age', '古丈期', 'Guzhangian', 500.5, 497, {
            tagline: '中国命名',
            notes: '以湖南古丈县罗依溪剖面为标准层型。',
          }),
        ]),
        n('furongian', 'epoch', '芙蓉世', 'Furongian', 497, 485.4, {
          tagline: '晚寒武世',
          notes: '"芙蓉"指湖南的别称。三叶虫多样性此期有所下降。',
        }, [
          n('paibian', 'age', '排碧期', 'Paibian', 497, 494, {
            tagline: '芙蓉世起始',
            notes: '以湖南花垣排碧为标准。',
          }),
          n('jiangshanian', 'age', '江山期', 'Jiangshanian', 494, 489.5, {
            tagline: '浙江命名',
            notes: '以浙江江山碓边剖面为标准。',
          }),
          n('cambrian_stage_10', 'age', '寒武纪第十期', 'Cambrian Stage 10', 489.5, 485.4, {
            tagline: '寒武纪末期',
            notes: '名称尚未正式确定。',
          }),
        ]),
      ]),

      // ▓▓▓ 奥陶纪 ▓▓▓
      n('ordovician', 'period', '奥陶纪', 'Ordovician', 485.4, 443.8, {
        color: '#6b8e7f', stratumColor: '#7ea092', pattern: 'marine', sketchId: 'ordovician',
        tagline: '海洋的黄金时代',
        events: [
          '奥陶纪生物大辐射（GOBE）',
          '最早的陆生植物（苔藓类）登陆',
          '最早的有颌鱼类出现',
          '奥陶纪末大灭绝：约 85% 物种消失',
        ],
        species: '直角石、鹦鹉螺、笔石、三叶虫、海百合、无颌鱼',
        notes: '直角石是当时海洋顶级掠食者，壳体最长可达 6 米。',
        temperature: '约 16°C（末期冰期骤降）',
      }, [
        n('lower_ordovician', 'epoch', '早奥陶世', 'Lower Ordovician', 485.4, 470, {
          tagline: '海洋辐射',
          notes: '笔石开始繁盛，成为重要的标准化石。',
        }, [
          n('tremadocian', 'age', '特马豆克期', 'Tremadocian', 485.4, 477.7, {
            tagline: '奥陶纪开端',
            notes: '以英国威尔士 Tremadoc 为名。',
          }),
          n('floian', 'age', '弗洛期', 'Floian', 477.7, 470, {
            tagline: '笔石辐射',
            notes: '以瑞典 Flo 剖面为标准。',
          }),
        ]),
        n('middle_ordovician', 'epoch', '中奥陶世', 'Middle Ordovician', 470, 458.4, {
          tagline: '珊瑚礁兴起',
          notes: '床板珊瑚与四射珊瑚形成早期珊瑚礁生态。',
        }, [
          n('dapingian', 'age', '大坪期', 'Dapingian', 470, 467.3, {
            tagline: '中奥陶世之始',
            notes: '以湖北宜昌大坪剖面为标准。',
          }),
          n('darriwilian', 'age', '达瑞威尔期', 'Darriwilian', 467.3, 458.4, {
            tagline: '以澳大利亚命名',
            notes: '以澳大利亚 Darriwil 地区为名。',
          }),
        ]),
        n('upper_ordovician', 'epoch', '晚奥陶世', 'Upper Ordovician', 458.4, 443.8, {
          tagline: '冰期与灭绝',
          notes: '冈瓦纳大陆进入南极形成冰盖，全球海平面下降，海洋生物遭受重创。',
        }, [
          n('sandbian', 'age', '桑比期', 'Sandbian', 458.4, 453, {
            tagline: '',
            notes: '以英国威尔士 Sunny Brae 地区为名。',
          }),
          n('katian', 'age', '凯迪期', 'Katian', 453, 445.2, {
            tagline: '生命极盛',
            notes: '海洋生物多样性达到奥陶纪顶峰。',
          }),
          n('hirnantian', 'age', '赫南特期', 'Hirnantian', 445.2, 443.8, {
            tagline: '大灭绝之期',
            notes: '奥陶纪末大灭绝发生，约 85% 物种在此期消失。',
          }),
        ]),
      ]),

      // ▓▓▓ 志留纪 ▓▓▓
      n('silurian', 'period', '志留纪', 'Silurian', 443.8, 419.2, {
        color: '#c9a961', stratumColor: '#d6b974', pattern: 'reef', sketchId: 'silurian',
        tagline: '登陆的先驱',
        events: [
          '最早的维管植物（顶囊蕨）出现',
          '有颌鱼类（棘鱼类、盾皮鱼）繁盛',
          '最早的陆生节肢动物（蝎子、多足类）',
          '珊瑚礁生态系统广泛发展',
        ],
        species: '板足鲎（海蝎）、棘鱼、盾皮鱼、笔石、顶囊蕨',
        notes: '板足鲎是当时令人畏惧的存在，某些种类长度超过 2 米。',
        temperature: '约 17°C',
      }, [
        n('llandovery', 'epoch', '兰多维列世', 'Llandovery', 443.8, 433.4, {
          tagline: '志留纪开端',
          notes: '以威尔士 Llandovery 镇为名。生命从奥陶末灭绝中恢复。',
        }, [
          n('rhuddanian', 'age', '鲁丹期', 'Rhuddanian', 443.8, 440.8, {
            tagline: '复苏',
            notes: '生物从大灭绝中开始复苏。',
          }),
          n('aeronian', 'age', '埃隆期', 'Aeronian', 440.8, 438.5, {
            tagline: '',
            notes: '以威尔士 Cwm-coed-Aeron 农场为名。',
          }),
          n('telychian', 'age', '特列奇期', 'Telychian', 438.5, 433.4, {
            tagline: '',
            notes: '以威尔士 Pen-lan-Telych 农场为名。',
          }),
        ]),
        n('wenlock', 'epoch', '温洛克世', 'Wenlock', 433.4, 427.4, {
          tagline: '珊瑚礁兴盛',
          notes: '英格兰温洛克石灰岩中保存了精美的珊瑚礁化石。',
        }, [
          n('sheinwoodian', 'age', '申伍德期', 'Sheinwoodian', 433.4, 430.5, {
            tagline: '',
            notes: '以英格兰 Sheinwood 村为名。',
          }),
          n('homerian', 'age', '侯默期', 'Homerian', 430.5, 427.4, {
            tagline: '',
            notes: '以英国什罗普郡 Homer 村为名。',
          }),
        ]),
        n('ludlow', 'epoch', '罗德洛世', 'Ludlow', 427.4, 423, {
          tagline: '',
          notes: '以英国 Ludlow 镇为名。植物开始登陆。',
        }, [
          n('gorstian', 'age', '高斯特期', 'Gorstian', 427.4, 425.6, {
            tagline: '',
            notes: '',
          }),
          n('ludfordian', 'age', '卢德福德期', 'Ludfordian', 425.6, 423, {
            tagline: '',
            notes: '',
          }),
        ]),
        n('pridoli', 'epoch', '普里道利世', 'Pridoli', 423, 419.2, {
          tagline: '志留纪末期',
          notes: '以捷克布拉格 Přídolí 地区为名。此世未进一步划分为期。',
        }),
      ]),

      // ▓▓▓ 泥盆纪 ▓▓▓
      n('devonian', 'period', '泥盆纪', 'Devonian', 419.2, 358.9, {
        color: '#a0522d', stratumColor: '#b06038', pattern: 'sandstone', sketchId: 'devonian',
        tagline: '鱼类时代',
        events: [
          '鱼类空前繁荣，称"鱼类时代"',
          '四足动物从肉鳍鱼演化而来',
          '最早的森林出现',
          '泥盆纪末大灭绝 —— 约 75% 物种消失',
        ],
        species: '邓氏鱼、提克塔利克鱼、鱼石螈、古羊齿',
        notes: '邓氏鱼咬合力估算达 5000 牛顿，体长 8 米 —— 泥盆纪海洋的噩梦。',
        temperature: '约 20°C',
      }, [
        n('lower_devonian', 'epoch', '早泥盆世', 'Lower Devonian', 419.2, 393.3, {
          tagline: '登陆先锋',
          notes: '植物、节肢动物不断扩张陆地生态。',
        }, [
          n('lochkovian', 'age', '洛赫考夫期', 'Lochkovian', 419.2, 410.8, {
            tagline: '泥盆纪开端',
            notes: '以捷克 Lochkov 村为名。',
          }),
          n('pragian', 'age', '布拉格期', 'Pragian', 410.8, 407.6, {
            tagline: '',
            notes: '以捷克首都布拉格为名。',
          }),
          n('emsian', 'age', '埃姆斯期', 'Emsian', 407.6, 393.3, {
            tagline: '',
            notes: '以德国 Ems 河谷为名。',
          }),
        ]),
        n('middle_devonian', 'epoch', '中泥盆世', 'Middle Devonian', 393.3, 382.7, {
          tagline: '森林初兴',
          notes: '古羊齿类树木形成世界最早的森林。',
        }, [
          n('eifelian', 'age', '艾菲尔期', 'Eifelian', 393.3, 387.7, {
            tagline: '',
            notes: '以德国艾菲尔山脉为名。',
          }),
          n('givetian', 'age', '吉维特期', 'Givetian', 387.7, 382.7, {
            tagline: '',
            notes: '以法国阿登省 Givet 镇为名。',
          }),
        ]),
        n('upper_devonian', 'epoch', '晚泥盆世', 'Upper Devonian', 382.7, 358.9, {
          tagline: '四足动物登陆',
          notes: '鱼石螈等最早的四足动物在此世晚期出现。',
        }, [
          n('frasnian', 'age', '弗拉斯期', 'Frasnian', 382.7, 372.2, {
            tagline: '',
            notes: '以比利时 Frasnes-lez-Couvin 村为名。末期发生凯尔瓦塞事件（弗-法灭绝）。',
          }),
          n('famennian', 'age', '法门期', 'Famennian', 372.2, 358.9, {
            tagline: '四足登陆',
            notes: '鱼石螈、棘螈出现。末期汉根堡事件再次造成生物危机。',
          }),
        ]),
      ]),

      // ▓▓▓ 石炭纪 ▓▓▓
      n('carboniferous', 'period', '石炭纪', 'Carboniferous', 358.9, 298.9, {
        color: '#2c4a2e', stratumColor: '#355a38', pattern: 'coal', sketchId: 'carboniferous',
        tagline: '煤炭森林',
        events: [
          '广袤热带沼泽森林形成今日主要煤层',
          '大气氧含量达地球史上最高（约 35%）',
          '巨型节肢动物繁盛',
          '羊膜动物（爬行类祖先）出现',
        ],
        species: '鳞木、封印木、巨脉蜻蜓、节胸蜈蚣、林蜥',
        notes: '真菌尚未演化出分解木质素的能力，因此大量植物遗体堆积成煤。',
        temperature: '约 14°C',
      }, [
        n('mississippian', 'epoch', '密西西比亚纪', 'Mississippian', 358.9, 323.2, {
          tagline: '早石炭世',
          notes: '以美国密西西比河流域为名。海相沉积为主，鲨鱼类繁盛。',
        }, [
          n('tournaisian', 'age', '杜内期', 'Tournaisian', 358.9, 346.7, {
            tagline: '石炭纪之始',
            notes: '以比利时 Tournai 镇为名。',
          }),
          n('visean', 'age', '维宪期', 'Visean', 346.7, 330.9, {
            tagline: '',
            notes: '以比利时 Visé 镇为名。',
          }),
          n('serpukhovian', 'age', '谢尔普霍夫期', 'Serpukhovian', 330.9, 323.2, {
            tagline: '',
            notes: '以俄罗斯 Serpukhov 镇为名。',
          }),
        ]),
        n('pennsylvanian', 'epoch', '宾夕法尼亚亚纪', 'Pennsylvanian', 323.2, 298.9, {
          tagline: '晚石炭世',
          notes: '以美国宾夕法尼亚州为名。广阔沼泽森林形成今日煤田。',
        }, [
          n('bashkirian', 'age', '巴什基尔期', 'Bashkirian', 323.2, 315.2, {
            tagline: '',
            notes: '以俄罗斯巴什基尔共和国为名。',
          }),
          n('moscovian', 'age', '莫斯科期', 'Moscovian', 315.2, 307, {
            tagline: '',
            notes: '以莫斯科盆地为名。',
          }),
          n('kasimovian', 'age', '卡西莫夫期', 'Kasimovian', 307, 303.7, {
            tagline: '',
            notes: '以俄罗斯 Kasimov 镇为名。',
          }),
          n('gzhelian', 'age', '格舍尔期', 'Gzhelian', 303.7, 298.9, {
            tagline: '',
            notes: '以俄罗斯 Gzhel 村为名。',
          }),
        ]),
      ]),

      // ▓▓▓ 二叠纪 ▓▓▓
      n('permian', 'period', '二叠纪', 'Permian', 298.9, 251.902, {
        color: '#8b3a3a', stratumColor: '#9c4444', pattern: 'red-bed', sketchId: 'permian',
        tagline: '盘古大陆',
        events: [
          '泛大陆（盘古）形成',
          '合弓纲（哺乳动物祖先）主导陆地',
          '二叠纪末大灭绝 —— 地球史上最严重',
          '约 96% 海洋物种、70% 陆地脊椎动物消失',
          '西伯利亚暗色岩大规模火山活动',
        ],
        species: '异齿龙、水龙兽、丽齿兽、舌羊齿植物',
        notes: '这次"大死亡"后，生命花了近千万年才恢复。划定古生代与中生代分界。',
        temperature: '末期急升至 25°C+',
      }, [
        n('cisuralian', 'epoch', '乌拉尔世', 'Cisuralian', 298.9, 273.01, {
          tagline: '早二叠世',
          notes: '以俄罗斯乌拉尔山以西地区为名。',
        }, [
          n('asselian', 'age', '阿瑟尔期', 'Asselian', 298.9, 293.52, {
            tagline: '二叠纪之始',
            notes: '以哈萨克 Assel 河为名。',
          }),
          n('sakmarian', 'age', '萨克马尔期', 'Sakmarian', 293.52, 290.1, {
            tagline: '',
            notes: '以俄罗斯 Sakmara 河为名。',
          }),
          n('artinskian', 'age', '亚丁斯克期', 'Artinskian', 290.1, 283.5, {
            tagline: '',
            notes: '以俄罗斯 Arti 镇为名。',
          }),
          n('kungurian', 'age', '空谷期', 'Kungurian', 283.5, 273.01, {
            tagline: '',
            notes: '以俄罗斯 Kungur 镇为名。',
          }),
        ]),
        n('guadalupian', 'epoch', '瓜德鲁普世', 'Guadalupian', 273.01, 259.51, {
          tagline: '中二叠世',
          notes: '以美国德州瓜达卢佩山为名。末期发生小规模灭绝。',
        }, [
          n('roadian', 'age', '罗德期', 'Roadian', 273.01, 266.9, {
            tagline: '',
            notes: '以德州 Road Canyon 地层为名。',
          }),
          n('wordian', 'age', '沃德期', 'Wordian', 266.9, 264.28, {
            tagline: '',
            notes: '以德州 Word Ranch 为名。',
          }),
          n('capitanian', 'age', '卡匹敦期', 'Capitanian', 264.28, 259.51, {
            tagline: '',
            notes: '以德州 Capitan 山为名。末期发生生物危机。',
          }),
        ]),
        n('lopingian', 'epoch', '乐平世', 'Lopingian', 259.51, 251.902, {
          tagline: '晚二叠世',
          notes: '以中国江西乐平为名。末期的大灭绝改变了地球生命史的进程。',
        }, [
          n('wuchiapingian', 'age', '吴家坪期', 'Wuchiapingian', 259.51, 254.14, {
            tagline: '',
            notes: '以中国陕西吴家坪为名。',
          }),
          n('changhsingian', 'age', '长兴期', 'Changhsingian', 254.14, 251.902, {
            tagline: '史上最大灭绝',
            notes: '以浙江长兴县为名。二叠纪-三叠纪灭绝事件发生在本期末期。',
          }),
        ]),
      ]),
    ]),

    // ─────── 中生代 ───────
    n('mesozoic', 'era', '中生代', 'Mesozoic', 251.902, 66, {
      tagline: '中间生命之代',
      notes: '恐龙的时代。从二叠末大灭绝废墟中崛起，到白垩纪末被小行星终结。被子植物在其间诞生。',
    }, [
      n('triassic', 'period', '三叠纪', 'Triassic', 251.902, 201.4, {
        color: '#b87333', stratumColor: '#c88341', pattern: 'desert', sketchId: 'triassic',
        tagline: '恐龙黎明',
        events: [
          '盘古大陆开始分裂',
          '最早的恐龙出现（始盗龙、埃雷拉龙）',
          '最早的哺乳动物出现',
          '最早的翼龙、鱼龙、蛇颈龙',
          '三叠纪末大灭绝（约 2.01 亿年前）',
        ],
        species: '始盗龙、板龙、鱼龙、幻龙、摩根齿兽、苏铁',
        notes: '三叠纪陆地干旱广阔，盘古大陆内部形成巨大沙漠。恐龙在此时尚未称霸。',
        temperature: '约 17°C（温暖干燥）',
      }, [
        n('lower_triassic', 'epoch', '早三叠世', 'Lower Triassic', 251.902, 247.2, {
          tagline: '浩劫之后',
          notes: '二叠末大灭绝后的荒芜期，水龙兽几乎占据陆地生态的一半。',
        }, [
          n('induan', 'age', '印度期', 'Induan', 251.902, 249.9, {
            tagline: '灭绝后的复苏',
            notes: '以印度河为名。生命刚刚开始从大灭绝中复苏。',
          }),
          n('olenekian', 'age', '奥伦尼克期', 'Olenekian', 249.9, 247.2, {
            tagline: '',
            notes: '以西伯利亚 Olenek 河为名。',
          }),
        ]),
        n('middle_triassic', 'epoch', '中三叠世', 'Middle Triassic', 247.2, 237, {
          tagline: '海洋爬行类兴起',
          notes: '鱼龙、幻龙等海洋爬行类开始繁盛。',
        }, [
          n('anisian', 'age', '安尼期', 'Anisian', 247.2, 242, {
            tagline: '',
            notes: '以奥地利 Anisus（Enns 河古名）为名。',
          }),
          n('ladinian', 'age', '拉丁期', 'Ladinian', 242, 237, {
            tagline: '',
            notes: '以意大利多洛米蒂山区 Ladin 民族为名。',
          }),
        ]),
        n('upper_triassic', 'epoch', '晚三叠世', 'Upper Triassic', 237, 201.4, {
          tagline: '恐龙初起',
          notes: '最早的恐龙和哺乳动物在此世出现。末期大灭绝为侏罗纪恐龙的扩张让路。',
        }, [
          n('carnian', 'age', '卡尼期', 'Carnian', 237, 227, {
            tagline: '卡尼湿润事件',
            notes: '以奥地利卡尼克阿尔卑斯为名。全球性的卡尼湿润事件改变气候。',
          }),
          n('norian', 'age', '诺利期', 'Norian', 227, 208.5, {
            tagline: '三叠纪最长期',
            notes: '以奥地利 Noricum 古罗马行省为名。恐龙逐渐多样化。',
          }),
          n('rhaetian', 'age', '瑞替期', 'Rhaetian', 208.5, 201.4, {
            tagline: '三叠末灭绝',
            notes: '以瑞士 Rhaetian 阿尔卑斯为名。末期中大西洋岩浆省的火山活动引发大灭绝。',
          }),
        ]),
      ]),
      n('jurassic', 'period', '侏罗纪', 'Jurassic', 201.4, 145, {
        color: '#556b2f', stratumColor: '#637a36', pattern: 'limestone', sketchId: 'jurassic',
        tagline: '巨龙盛世',
        events: [
          '恐龙成为陆地霸主',
          '最早的鸟类 —— 始祖鸟',
          '大西洋开始形成',
          '裸子植物（苏铁、松柏、银杏）繁盛',
        ],
        species: '梁龙、腕龙、剑龙、异特龙、始祖鸟、菊石',
        notes: '索伦霍芬石灰岩是最精美的拉格斯塔之一，始祖鸟羽毛印痕至今让人惊叹。',
        temperature: '约 16.5°C（温暖湿润）',
      }, [
        n('lower_jurassic', 'epoch', '早侏罗世', 'Lower Jurassic', 201.4, 174.7, {
          tagline: '恐龙辐射之始',
          notes: '恐龙经过三叠末灭绝后迅速占领生态位。海洋爬行类繁盛。',
        }, [
          n('hettangian', 'age', '赫塘期', 'Hettangian', 201.4, 199.5, {
            tagline: '侏罗纪开端', notes: '以法国 Hettange-Grande 镇为名。',
          }),
          n('sinemurian', 'age', '辛涅缪尔期', 'Sinemurian', 199.5, 192.9, {
            tagline: '', notes: '以法国 Semur-en-Auxois 为名。',
          }),
          n('pliensbachian', 'age', '普林斯巴期', 'Pliensbachian', 192.9, 184.2, {
            tagline: '', notes: '以德国 Pliensbach 村为名。',
          }),
          n('toarcian', 'age', '托阿尔期', 'Toarcian', 184.2, 174.7, {
            tagline: '海洋缺氧事件', notes: '以法国 Thouars 镇为名。托阿尔海洋缺氧事件造成局部灭绝。',
          }),
        ]),
        n('middle_jurassic', 'epoch', '中侏罗世', 'Middle Jurassic', 174.7, 161.5, {
          tagline: '蜥脚类黄金期',
          notes: '巨型蜥脚类恐龙开始多样化，鸟类祖先出现。',
        }, [
          n('aalenian', 'age', '阿连期', 'Aalenian', 174.7, 170.9, {
            tagline: '', notes: '以德国 Aalen 镇为名。',
          }),
          n('bajocian', 'age', '巴柔期', 'Bajocian', 170.9, 168.2, {
            tagline: '', notes: '以法国 Bayeux（古称 Bajoce）为名。',
          }),
          n('bathonian', 'age', '巴通期', 'Bathonian', 168.2, 165.3, {
            tagline: '', notes: '以英国 Bath 市为名。',
          }),
          n('callovian', 'age', '卡洛夫期', 'Callovian', 165.3, 161.5, {
            tagline: '', notes: '以英国 Kellaways 村为名。',
          }),
        ]),
        n('upper_jurassic', 'epoch', '晚侏罗世', 'Upper Jurassic', 161.5, 145, {
          tagline: '始祖鸟时代',
          notes: '侏罗纪最著名的化石群都来自此世：莫里森组、索伦霍芬灰岩、我国辽西层。',
        }, [
          n('oxfordian', 'age', '牛津期', 'Oxfordian', 161.5, 154.8, {
            tagline: '', notes: '以英国牛津为名。',
          }),
          n('kimmeridgian', 'age', '钦莫利期', 'Kimmeridgian', 154.8, 149.2, {
            tagline: '', notes: '以英国 Kimmeridge 村为名。',
          }),
          n('tithonian', 'age', '提塘期', 'Tithonian', 149.2, 145, {
            tagline: '始祖鸟之期', notes: '德国索伦霍芬灰岩中的始祖鸟化石来自此期。',
          }),
        ]),
      ]),
      n('cretaceous', 'period', '白垩纪', 'Cretaceous', 145, 66, {
        color: '#f5e6a8', stratumColor: '#ebd88a', pattern: 'chalk', sketchId: 'cretaceous',
        tagline: '白垩与终结',
        events: [
          '被子植物大辐射',
          '霸王龙、三角龙等著名恐龙晚期出现',
          '海平面达显生宙最高点',
          'K-Pg 大灭绝（6600 万年前）：希克苏鲁伯小行星撞击',
          '约 75% 物种消失，非鸟恐龙灭绝',
        ],
        species: '霸王龙、三角龙、副栉龙、沧龙、翼龙、孔子鸟',
        notes: '全球 K-Pg 边界层富含铱元素 —— 来自那颗直径 10 公里的撞击者。',
        temperature: '约 18°C',
      }, [
        n('lower_cretaceous', 'epoch', '早白垩世', 'Lower Cretaceous', 145, 100.5, {
          tagline: '被子植物萌芽',
          notes: '开花植物在此世出现并快速辐射。我国热河生物群世界闻名。',
        }, [
          n('berriasian', 'age', '贝里阿斯期', 'Berriasian', 145, 139.8, {
            tagline: '白垩纪开端', notes: '以法国 Berrias 村为名。',
          }),
          n('valanginian', 'age', '瓦兰今期', 'Valanginian', 139.8, 132.6, {
            tagline: '', notes: '以瑞士 Valangin 城堡为名。',
          }),
          n('hauterivian', 'age', '欧特里夫期', 'Hauterivian', 132.6, 125.77, {
            tagline: '', notes: '以瑞士 Hauterive 为名。',
          }),
          n('barremian', 'age', '巴雷姆期', 'Barremian', 125.77, 121.4, {
            tagline: '热河动物群',
            notes: '我国辽西热河生物群的孔子鸟、带羽毛恐龙化石来自此期。',
          }),
          n('aptian', 'age', '阿普特期', 'Aptian', 121.4, 113.2, {
            tagline: '', notes: '以法国 Apt 镇为名。',
          }),
          n('albian', 'age', '阿尔布期', 'Albian', 113.2, 100.5, {
            tagline: '白垩纪最长期',
            notes: '以法国 Aube 河（拉丁名 Alba）为名。',
          }),
        ]),
        n('upper_cretaceous', 'epoch', '晚白垩世', 'Upper Cretaceous', 100.5, 66, {
          tagline: '恐龙盛宴与终章',
          notes: '霸王龙、三角龙、鸭嘴龙等著名恐龙来自此世。末期小行星撞击结束恐龙时代。',
        }, [
          n('cenomanian', 'age', '森诺曼期', 'Cenomanian', 100.5, 93.9, {
            tagline: '', notes: '以法国 Cenomanum（Le Mans 古名）为名。',
          }),
          n('turonian', 'age', '土仑期', 'Turonian', 93.9, 89.8, {
            tagline: '', notes: '以法国 Turonia（Tours 古名）为名。',
          }),
          n('coniacian', 'age', '科尼亚克期', 'Coniacian', 89.8, 86.3, {
            tagline: '', notes: '以法国 Cognac 镇为名。',
          }),
          n('santonian', 'age', '桑顿期', 'Santonian', 86.3, 83.6, {
            tagline: '', notes: '以法国 Saintonge 地区为名。',
          }),
          n('campanian', 'age', '坎潘期', 'Campanian', 83.6, 72.17, {
            tagline: '晚白垩世最长期',
            notes: '以法国 Champagne 地区为名。霸王龙的直接祖先出现。',
          }),
          n('maastrichtian', 'age', '马斯特里赫特期', 'Maastrichtian', 72.17, 66, {
            tagline: '恐龙的最后一期',
            notes: '以荷兰马斯特里赫特为名。末期小行星撞击终结非鸟恐龙。',
          }),
        ]),
      ]),
    ]),

    // ─────── 新生代 ───────
    n('cenozoic', 'era', '新生代', 'Cenozoic', 66, 0, {
      tagline: '新近生命之代',
      notes: '哺乳动物的时代。从恐龙灭绝的废墟中崛起，经历冰期轮回，直到人类的出现。',
    }, [
      n('paleogene', 'period', '古近纪', 'Paleogene', 66, 23.03, {
        color: '#d4a373', stratumColor: '#c29461', pattern: 'mudstone', sketchId: 'paleogene',
        tagline: '哺乳时代开启',
        events: [
          '恐龙灭绝后哺乳动物迅速辐射',
          '古新世-始新世极热事件（PETM, 约 5600 万年前）',
          '最早的灵长类、鲸类、蹄类',
          '印度板块碰撞欧亚，喜马拉雅开始隆升',
          '始新世末气候转凉，南极冰盖形成',
        ],
        species: '走鲸、始祖马、泰坦鸟、始猫、恐角兽',
        notes: 'PETM 期间全球升温约 5–8°C，是理解当今气候变化的重要地质参照。',
        temperature: '从 25°C 降至 18°C',
      }, [
        n('paleocene', 'epoch', '古新世', 'Paleocene', 66, 56, {
          tagline: '恐龙后的黎明',
          notes: '大灭绝后的生态真空被小型哺乳动物迅速填补。',
        }, [
          n('danian', 'age', '丹尼期', 'Danian', 66, 61.66, {
            tagline: '新生代第一期', notes: '以丹麦（Dania）为名。紧接 K-Pg 边界之后。',
          }),
          n('selandian', 'age', '塞兰特期', 'Selandian', 61.66, 59.24, {
            tagline: '', notes: '以丹麦西兰岛（Sjælland）为名。',
          }),
          n('thanetian', 'age', '坦尼特期', 'Thanetian', 59.24, 56, {
            tagline: '', notes: '以英格兰 Thanet 岛为名。末期发生 PETM。',
          }),
        ]),
        n('eocene', 'epoch', '始新世', 'Eocene', 56, 33.9, {
          tagline: '极热时代',
          notes: '始新世早期是新生代最热时期，北极圈内生长棕榈树。',
        }, [
          n('ypresian', 'age', '伊普里斯期', 'Ypresian', 56, 47.8, {
            tagline: 'PETM 高峰',
            notes: '以比利时 Ypres 市为名。古新世-始新世极热事件（PETM）发生在本期初。',
          }),
          n('lutetian', 'age', '卢泰特期', 'Lutetian', 47.8, 41.2, {
            tagline: '', notes: '以巴黎拉丁名 Lutetia 为名。',
          }),
          n('bartonian', 'age', '巴顿期', 'Bartonian', 41.2, 37.71, {
            tagline: '', notes: '以英国 Barton-on-Sea 为名。',
          }),
          n('priabonian', 'age', '普利亚本期', 'Priabonian', 37.71, 33.9, {
            tagline: '始新世末冰冻',
            notes: '以意大利 Priabona 村为名。末期气候骤冷，南极冰盖形成。',
          }),
        ]),
        n('oligocene', 'epoch', '渐新世', 'Oligocene', 33.9, 23.03, {
          tagline: '冰室地球',
          notes: '南极完全被冰盖覆盖，现代草原开始形成。',
        }, [
          n('rupelian', 'age', '吕珀尔期', 'Rupelian', 33.9, 27.82, {
            tagline: '', notes: '以比利时 Rupel 河为名。',
          }),
          n('chattian', 'age', '夏特期', 'Chattian', 27.82, 23.03, {
            tagline: '', notes: '以德国 Chatti 部落为名。',
          }),
        ]),
      ]),
      n('neogene', 'period', '新近纪', 'Neogene', 23.03, 2.58, {
        color: '#8a9a5b', stratumColor: '#7a8a4d', pattern: 'grassland', sketchId: 'neogene',
        tagline: '草原与人猿',
        events: [
          '禾本科扩张，草原生态系统形成',
          '食草哺乳动物大辐射',
          '墨西拿盐度危机（600–530 万年前）：地中海干涸',
          '人族与黑猩猩分化（约 700 万年前）',
          '南方古猿出现（露西，约 320 万年前）',
        ],
        species: '猛犸祖先、剑齿虎、南方古猿、巨猿、巨齿鲨',
        notes: '巨齿鲨体长可达 15–18 米，是史上最大的掠食性鲨鱼。',
        temperature: '约 14°C（持续下降）',
      }, [
        n('miocene', 'epoch', '中新世', 'Miocene', 23.03, 5.333, {
          tagline: '类人猿兴起',
          notes: '类人猿（包括人类祖先）在此世多样化。非洲与亚欧相连，物种大交换。',
        }, [
          n('aquitanian', 'age', '阿基坦期', 'Aquitanian', 23.03, 20.44, {
            tagline: '新近纪开端', notes: '以法国阿基坦地区为名。',
          }),
          n('burdigalian', 'age', '波尔多期', 'Burdigalian', 20.44, 15.98, {
            tagline: '', notes: '以法国波尔多（Burdigala）为名。',
          }),
          n('langhian', 'age', '兰盖期', 'Langhian', 15.98, 13.82, {
            tagline: '', notes: '以意大利 Langhe 地区为名。',
          }),
          n('serravallian', 'age', '塞拉瓦莱期', 'Serravallian', 13.82, 11.63, {
            tagline: '', notes: '以意大利 Serravalle Scrivia 镇为名。',
          }),
          n('tortonian', 'age', '托尔托纳期', 'Tortonian', 11.63, 7.246, {
            tagline: '', notes: '以意大利 Tortona 镇为名。',
          }),
          n('messinian', 'age', '墨西拿期', 'Messinian', 7.246, 5.333, {
            tagline: '地中海干涸',
            notes: '以西西里 Messina 为名。墨西拿盐度危机 —— 地中海一度完全干涸。',
          }),
        ]),
        n('pliocene', 'epoch', '上新世', 'Pliocene', 5.333, 2.58, {
          tagline: '原始人扩散',
          notes: '南方古猿出现，人类演化进入决定性阶段。',
        }, [
          n('zanclean', 'age', '赞克尔期', 'Zanclean', 5.333, 3.6, {
            tagline: '赞克尔大洪水',
            notes: '以西西里 Zancle（Messina 古名）为名。大西洋水流入使地中海再次注满。',
          }),
          n('piacenzian', 'age', '皮亚琴察期', 'Piacenzian', 3.6, 2.58, {
            tagline: '',
            notes: '以意大利 Piacenza 市为名。露西（320 万年前）生活于此期。',
          }),
        ]),
      ]),
      n('quaternary', 'period', '第四纪', 'Quaternary', 2.58, 0, {
        color: '#e8e4d0', stratumColor: '#d8d4c0', pattern: 'ice', sketchId: 'quaternary',
        tagline: '冰川与人类',
        events: [
          '反复的冰期 — 间冰期旋回（约 10 万年周期）',
          '智人约 30 万年前出现于非洲',
          '更新世末大型哺乳动物灭绝',
          '全新世：约 11,700 年前至今 —— 人类文明兴起',
          '"人类世"的提出 —— 人类成为地质力量',
        ],
        species: '猛犸、披毛犀、大地懒、尼安德特人、智人',
        notes: '我们正在自己的地层里。塑料、放射性同位素、畜牧骨骼的堆积，未来地质学家将轻易辨识这个时代。',
        temperature: '约 14°C（现代），冰期降至 10°C',
      }, [
        n('pleistocene', 'epoch', '更新世', 'Pleistocene', 2.58, 0.0117, {
          tagline: '大冰期',
          notes: '冰期 — 间冰期剧烈旋回。猛犸象、剑齿虎等冰河巨兽横行。',
        }, [
          n('gelasian', 'age', '格拉斯期', 'Gelasian', 2.58, 1.8, {
            tagline: '第四纪之始',
            notes: '以西西里 Gela 市为名。北半球大规模冰川作用开始。',
          }, [
            n('matuyama_chron', 'chron', '松山反向极性时', 'Matuyama Reverse', 2.58, 0.78, {
              tagline: '反向磁极',
              notes: '以日本地球物理学家松山基范命名。地球磁场在此时处于反向状态，指南针会指向南方。',
            }),
          ]),
          n('calabrian', 'age', '卡拉布里期', 'Calabrian', 1.8, 0.774, {
            tagline: '早更新世',
            notes: '以意大利卡拉布里亚大区为名。',
          }, [
            n('jaramillo_subchron', 'chron', '哈拉米略正向亚时', 'Jaramillo Normal', 1.07, 0.99, {
              tagline: '短暂的正向插曲',
              notes: '松山反向时中的一个短暂正向极性亚时，持续约 8 万年。',
            }),
            n('olduvai_subchron', 'chron', '奥杜威正向亚时', 'Olduvai Normal', 1.95, 1.77, {
              tagline: '奥杜威峡谷',
              notes: '以坦桑尼亚奥杜威峡谷（著名古人类遗址）为名。早期人属化石来自这一带。',
            }),
          ]),
          n('chibanian', 'age', '奇班期', 'Chibanian', 0.774, 0.129, {
            tagline: '中更新世',
            notes: '以日本千叶（Chiba）为名 —— 首个由日本命名的地质年代（2020 年确立）。',
          }, [
            n('brunhes_chron', 'chron', '布容正向极性时', 'Brunhes Normal', 0.78, 0, {
              tagline: '当代磁场',
              notes: '以法国地球物理学家布容命名。自 78 万年前至今地球磁场持续正向 —— 我们生活在这个磁性时代。',
            }),
          ]),
          n('upper_pleistocene', 'age', '晚更新世', 'Late Pleistocene', 0.129, 0.0117, {
            tagline: '人类扩散之期',
            notes: '正式命名仍在审议（建议名 Tarantian）。现代智人走出非洲，尼安德特人灭绝。',
          }),
        ]),
        n('holocene', 'epoch', '全新世', 'Holocene', 0.0117, 0, {
          tagline: '人类文明之世',
          notes: '从最后一次冰期结束到今日。农业、城市、文明全部诞生于此。2018 年 ICS 首次用气候学标志划分出三个期。',
        }, [
          n('greenlandian', 'age', '格陵兰期', 'Greenlandian', 0.0117, 0.0082, {
            tagline: '冰期结束',
            notes: '以格陵兰冰芯 NGRIP2 为标准。末次冰期刚刚结束，气候逐渐温暖。',
          }),
          n('northgrippian', 'age', '诺斯格瑞比期', 'Northgrippian', 0.0082, 0.0042, {
            tagline: '全新世气候适宜期',
            notes: '以格陵兰 NGRIP1 冰芯为名。全球气候温暖稳定，农业与定居生活起源。',
          }),
          n('meghalayan', 'age', '梅加拉亚期', 'Meghalayan', 0.0042, 0, {
            tagline: '人类文明之期',
            notes: '以印度梅加拉亚邦玛木鲁洞穴石笋为标准。4200 年前的全球性干旱事件为起点 —— 我们就生活在这一期。',
          }),
        ]),
      ]),
    ]),
  ]),
];

// ============ 样式与字体注入 ============
if (typeof document !== 'undefined' && !document.getElementById('geology-fonts')) {
  const link = document.createElement('link');
  link.id = 'geology-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,400;0,500;1,400&family=Special+Elite&family=Noto+Serif+SC:wght@400;500;600;700&family=Ma+Shan+Zheng&display=swap';
  document.head.appendChild(link);
}

// ============ 纸张纹理组件 ============
const PaperTexture = () => (
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',opacity:0.35,mixBlendMode:'multiply'}} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="paperNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/>
        <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.4 0"/>
      </filter>
      <filter id="paperFiber">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="3"/>
        <feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0.18 0"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" filter="url(#paperNoise)"/>
    <rect width="100%" height="100%" filter="url(#paperFiber)"/>
  </svg>
);

// ============ 墨点装饰 ============
const InkBlot = ({cx, cy, r, opacity=0.5, seed=1}) => {
  const pts = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const variance = 0.7 + 0.6 * Math.sin(seed * i * 1.7);
    const rr = r * variance;
    pts.push(`${cx + Math.cos(angle) * rr},${cy + Math.sin(angle) * rr}`);
  }
  return <polygon points={pts.join(' ')} fill="#2a1810" opacity={opacity} />;
};

// ============ 罗盘徽记 ============
const CompassRose = ({size=72}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill="none" stroke="#2a1810" strokeWidth="1.2" opacity="0.8"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="#2a1810" strokeWidth="0.5" opacity="0.6"/>
    {[0,45,90,135,180,225,270,315].map(a => {
      const rad = (a - 90) * Math.PI / 180;
      const len = a % 90 === 0 ? 38 : 30;
      return (
        <g key={a}>
          <line x1="50" y1="50" x2={50+Math.cos(rad)*len} y2={50+Math.sin(rad)*len} stroke="#2a1810" strokeWidth={a%90===0?1.5:0.8} opacity="0.85"/>
        </g>
      );
    })}
    <polygon points="50,12 47,50 50,48 53,50" fill="#8b3a1a" opacity="0.85"/>
    <polygon points="50,88 47,52 50,50 53,52" fill="#2a1810" opacity="0.7"/>
    <circle cx="50" cy="50" r="3" fill="#2a1810"/>
    <text x="50" y="10" textAnchor="middle" fontSize="6" fill="#2a1810" fontFamily="Cormorant Garamond">N</text>
  </svg>
);

// ============ 地层图案定义 ============
const StratumPatterns = () => (
  <svg width="0" height="0" style={{position:'absolute'}}>
    <defs>
      {/* 火成岩 */}
      <pattern id="pat-igneous" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="currentColor" opacity="0.7"/>
        <path d="M3,3 L5,1 L7,4 M9,7 L11,5 L13,8 M2,10 L4,8 L6,11" stroke="#2a1810" strokeWidth="0.6" fill="none" opacity="0.5"/>
      </pattern>
      {/* 带状 (太古代 BIF) */}
      <pattern id="pat-banded" x="0" y="0" width="10" height="8" patternUnits="userSpaceOnUse">
        <rect width="10" height="8" fill="currentColor" opacity="0.75"/>
        <line x1="0" y1="2" x2="10" y2="2" stroke="#2a1810" strokeWidth="0.5" opacity="0.6"/>
        <line x1="0" y1="5" x2="10" y2="5" stroke="#3a2515" strokeWidth="0.3" opacity="0.4"/>
      </pattern>
      {/* 层状 */}
      <pattern id="pat-laminated" x="0" y="0" width="12" height="6" patternUnits="userSpaceOnUse">
        <rect width="12" height="6" fill="currentColor" opacity="0.7"/>
        <line x1="0" y1="1.5" x2="12" y2="1.5" stroke="#2a1810" strokeWidth="0.3" opacity="0.5"/>
        <line x1="0" y1="4.5" x2="12" y2="4.5" stroke="#2a1810" strokeWidth="0.3" opacity="0.5"/>
      </pattern>
      {/* 富化石 */}
      <pattern id="pat-fossil-rich" x="0" y="0" width="16" height="12" patternUnits="userSpaceOnUse">
        <rect width="16" height="12" fill="currentColor" opacity="0.7"/>
        <circle cx="4" cy="3" r="1.2" fill="#2a1810" opacity="0.4"/>
        <path d="M9,8 Q11,7 13,8 Q11,9 9,8" fill="#2a1810" opacity="0.4"/>
        <circle cx="13" cy="3" r="0.8" fill="#2a1810" opacity="0.35"/>
      </pattern>
      {/* 海相 */}
      <pattern id="pat-marine" x="0" y="0" width="16" height="10" patternUnits="userSpaceOnUse">
        <rect width="16" height="10" fill="currentColor" opacity="0.7"/>
        <path d="M0,5 Q4,3 8,5 T16,5" stroke="#2a1810" strokeWidth="0.5" fill="none" opacity="0.5"/>
      </pattern>
      {/* 礁 */}
      <pattern id="pat-reef" x="0" y="0" width="14" height="10" patternUnits="userSpaceOnUse">
        <rect width="14" height="10" fill="currentColor" opacity="0.75"/>
        <path d="M2,8 L3,5 L4,8 M6,8 L8,4 L10,8 M11,8 L12,6 L13,8" stroke="#2a1810" strokeWidth="0.5" fill="none" opacity="0.55"/>
      </pattern>
      {/* 砂岩 */}
      <pattern id="pat-sandstone" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="currentColor" opacity="0.7"/>
        <circle cx="2" cy="2" r="0.6" fill="#2a1810" opacity="0.45"/>
        <circle cx="6" cy="4" r="0.5" fill="#2a1810" opacity="0.4"/>
        <circle cx="3" cy="7" r="0.7" fill="#2a1810" opacity="0.5"/>
        <circle cx="8" cy="8" r="0.4" fill="#2a1810" opacity="0.35"/>
      </pattern>
      {/* 煤 */}
      <pattern id="pat-coal" x="0" y="0" width="12" height="6" patternUnits="userSpaceOnUse">
        <rect width="12" height="6" fill="currentColor" opacity="0.85"/>
        <line x1="0" y1="2" x2="12" y2="2" stroke="#0a0a0a" strokeWidth="0.6" opacity="0.7"/>
        <line x1="0" y1="4.5" x2="12" y2="4.5" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.6"/>
      </pattern>
      {/* 红层 */}
      <pattern id="pat-red-bed" x="0" y="0" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect width="12" height="8" fill="currentColor" opacity="0.8"/>
        <line x1="0" y1="2.5" x2="12" y2="2.5" stroke="#5a1a0a" strokeWidth="0.4" opacity="0.5"/>
        <line x1="0" y1="6" x2="12" y2="6" stroke="#5a1a0a" strokeWidth="0.4" opacity="0.5"/>
      </pattern>
      {/* 沙漠 */}
      <pattern id="pat-desert" x="0" y="0" width="18" height="12" patternUnits="userSpaceOnUse">
        <rect width="18" height="12" fill="currentColor" opacity="0.7"/>
        <path d="M0,8 Q5,5 10,8 T18,8" stroke="#2a1810" strokeWidth="0.4" fill="none" opacity="0.4"/>
        <path d="M0,3 Q4,1 9,3 T18,3" stroke="#2a1810" strokeWidth="0.3" fill="none" opacity="0.3"/>
      </pattern>
      {/* 灰岩 */}
      <pattern id="pat-limestone" x="0" y="0" width="18" height="12" patternUnits="userSpaceOnUse">
        <rect width="18" height="12" fill="currentColor" opacity="0.7"/>
        <rect x="0" y="0" width="8" height="4" fill="none" stroke="#2a1810" strokeWidth="0.3" opacity="0.4"/>
        <rect x="9" y="0" width="9" height="4" fill="none" stroke="#2a1810" strokeWidth="0.3" opacity="0.4"/>
        <rect x="0" y="6" width="9" height="5" fill="none" stroke="#2a1810" strokeWidth="0.3" opacity="0.4"/>
        <rect x="10" y="6" width="8" height="5" fill="none" stroke="#2a1810" strokeWidth="0.3" opacity="0.4"/>
      </pattern>
      {/* 白垩 */}
      <pattern id="pat-chalk" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="currentColor" opacity="0.85"/>
        <circle cx="2" cy="3" r="0.3" fill="#2a1810" opacity="0.25"/>
        <circle cx="6" cy="6" r="0.25" fill="#2a1810" opacity="0.2"/>
        <circle cx="5" cy="1" r="0.2" fill="#2a1810" opacity="0.2"/>
      </pattern>
      {/* 泥岩 */}
      <pattern id="pat-mudstone" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
        <rect width="14" height="8" fill="currentColor" opacity="0.75"/>
        <line x1="0" y1="3" x2="14" y2="3" stroke="#2a1810" strokeWidth="0.3" opacity="0.5" strokeDasharray="3,2"/>
        <line x1="0" y1="6" x2="14" y2="6" stroke="#2a1810" strokeWidth="0.3" opacity="0.4" strokeDasharray="2,3"/>
      </pattern>
      {/* 草原 */}
      <pattern id="pat-grassland" x="0" y="0" width="12" height="10" patternUnits="userSpaceOnUse">
        <rect width="12" height="10" fill="currentColor" opacity="0.7"/>
        <line x1="2" y1="10" x2="2" y2="6" stroke="#2a1810" strokeWidth="0.4" opacity="0.5"/>
        <line x1="5" y1="10" x2="5" y2="5" stroke="#2a1810" strokeWidth="0.4" opacity="0.5"/>
        <line x1="8" y1="10" x2="8" y2="7" stroke="#2a1810" strokeWidth="0.4" opacity="0.5"/>
        <line x1="11" y1="10" x2="11" y2="4" stroke="#2a1810" strokeWidth="0.4" opacity="0.5"/>
      </pattern>
      {/* 冰 */}
      <pattern id="pat-ice" x="0" y="0" width="14" height="10" patternUnits="userSpaceOnUse">
        <rect width="14" height="10" fill="currentColor" opacity="0.6"/>
        <path d="M3,2 L5,5 L3,8 M10,1 L8,4 L10,7 L8,9" stroke="#2a1810" strokeWidth="0.5" fill="none" opacity="0.4"/>
      </pattern>
    </defs>
  </svg>
);

// ============ 物种速写 (继承自 v1) ============
const SpeciesSketch = ({id, size=100}) => {
  const sketches = {
    hadean: (
      <g>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#2a1810" strokeWidth="1.2"/>
        <path d="M32,45 Q40,38 48,42 Q55,48 62,40 Q68,45 65,55" stroke="#8b3a1a" strokeWidth="1" fill="none" opacity="0.7"/>
        <path d="M35,58 Q42,55 48,60 Q55,58 60,62" stroke="#8b3a1a" strokeWidth="0.8" fill="none" opacity="0.6"/>
        <circle cx="42" cy="38" r="2" fill="#8b3a1a" opacity="0.5"/>
        <circle cx="58" cy="52" r="1.5" fill="#8b3a1a" opacity="0.5"/>
      </g>
    ),
    archean: (
      <g>
        <ellipse cx="50" cy="65" rx="30" ry="5" fill="none" stroke="#2a1810" strokeWidth="0.8"/>
        <path d="M25,63 Q30,35 35,58 M35,60 Q40,30 45,55 M45,58 Q50,32 55,55 M55,57 Q60,35 65,58 M65,60 Q70,38 75,62" stroke="#2a1810" strokeWidth="0.9" fill="none"/>
        <ellipse cx="50" cy="65" rx="25" ry="3" fill="#2a1810" opacity="0.15"/>
      </g>
    ),
    proterozoic: (
      <g>
        <path d="M50,25 Q62,35 65,50 Q60,62 50,65 Q40,62 35,50 Q38,35 50,25" fill="none" stroke="#2a1810" strokeWidth="1"/>
        <path d="M45,35 Q50,40 55,35 M42,48 Q50,52 58,48 M45,58 Q50,55 55,58" stroke="#2a1810" strokeWidth="0.6" fill="none" opacity="0.7"/>
        <circle cx="50" cy="45" r="3" fill="none" stroke="#2a1810" strokeWidth="0.6"/>
      </g>
    ),
    cambrian: (
      <g>
        <path d="M20,50 L25,38 L35,32 L50,30 L65,32 L75,38 L80,50 L75,62 L65,68 L50,70 L35,68 L25,62 Z" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <line x1="30" y1="40" x2="30" y2="60" stroke="#2a1810" strokeWidth="0.6"/>
        <line x1="40" y1="34" x2="40" y2="66" stroke="#2a1810" strokeWidth="0.6"/>
        <line x1="50" y1="32" x2="50" y2="68" stroke="#2a1810" strokeWidth="0.7"/>
        <line x1="60" y1="34" x2="60" y2="66" stroke="#2a1810" strokeWidth="0.6"/>
        <line x1="70" y1="40" x2="70" y2="60" stroke="#2a1810" strokeWidth="0.6"/>
        <circle cx="35" cy="42" r="1.5" fill="#2a1810"/>
        <circle cx="65" cy="42" r="1.5" fill="#2a1810"/>
      </g>
    ),
    ordovician: (
      <g>
        <path d="M15,55 Q30,50 45,55 L75,55 L80,50 L80,60 L75,55 L72,60 L68,55 L65,62 L60,55" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <ellipse cx="30" cy="55" rx="18" ry="8" fill="none" stroke="#2a1810" strokeWidth="0.9"/>
        <circle cx="25" cy="53" r="1.8" fill="#2a1810"/>
        <line x1="20" y1="55" x2="12" y2="50" stroke="#2a1810" strokeWidth="0.7"/>
        <line x1="20" y1="58" x2="12" y2="62" stroke="#2a1810" strokeWidth="0.7"/>
      </g>
    ),
    silurian: (
      <g>
        <path d="M15,55 Q20,45 30,45 L60,45 Q72,45 75,52 L70,55 L75,58 Q72,65 60,65 L30,65 Q20,65 15,55" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <circle cx="22" cy="52" r="2" fill="#2a1810"/>
        <line x1="28" y1="45" x2="25" y2="38" stroke="#2a1810" strokeWidth="0.7"/>
        <line x1="32" y1="45" x2="30" y2="38" stroke="#2a1810" strokeWidth="0.7"/>
        <line x1="62" y1="65" x2="66" y2="72" stroke="#2a1810" strokeWidth="0.8"/>
        <line x1="68" y1="65" x2="72" y2="72" stroke="#2a1810" strokeWidth="0.8"/>
      </g>
    ),
    devonian: (
      <g>
        <path d="M15,50 Q25,35 45,40 Q65,35 85,42 Q80,50 85,58 Q65,65 45,60 Q25,65 15,50" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <circle cx="78" cy="48" r="2.5" fill="#2a1810"/>
        <path d="M15,50 L5,42 L8,50 L5,58 Z" fill="none" stroke="#2a1810" strokeWidth="0.9"/>
        <path d="M60,40 L65,30 L58,35 Z" fill="none" stroke="#2a1810" strokeWidth="0.7"/>
        <line x1="35" y1="48" x2="45" y2="52" stroke="#2a1810" strokeWidth="0.5"/>
        <line x1="45" y1="48" x2="55" y2="52" stroke="#2a1810" strokeWidth="0.5"/>
      </g>
    ),
    carboniferous: (
      <g>
        <line x1="50" y1="75" x2="50" y2="20" stroke="#2a1810" strokeWidth="1.4"/>
        <path d="M50,25 L38,15 M50,25 L62,15 M50,35 L35,30 M50,35 L65,30 M50,45 L32,45 M50,45 L68,45 M50,55 L35,60 M50,55 L65,60" stroke="#2a1810" strokeWidth="1.1" fill="none"/>
        <ellipse cx="40" cy="15" rx="4" ry="2" fill="none" stroke="#2a1810" strokeWidth="0.7"/>
        <ellipse cx="60" cy="15" rx="4" ry="2" fill="none" stroke="#2a1810" strokeWidth="0.7"/>
      </g>
    ),
    permian: (
      <g>
        <path d="M15,60 Q25,40 45,45 Q65,40 80,50 Q82,60 78,65 L70,65 L72,75 L60,75 L60,70 L45,72 L45,80 L35,80 L35,72 L22,72 L20,78 L12,75 Z" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <path d="M45,45 L42,28 L38,25 L42,20 L48,22 L50,28 Z" fill="none" stroke="#2a1810" strokeWidth="1"/>
        <circle cx="73" cy="52" r="1.8" fill="#2a1810"/>
      </g>
    ),
    triassic: (
      <g>
        <path d="M15,65 L25,55 Q35,45 50,48 Q65,45 75,52 L78,60 Q80,65 78,70 L70,70 L68,75 L60,75 L60,70 L40,70 L38,75 L30,75 L30,70 L18,70 Z" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <line x1="55" y1="45" x2="55" y2="32" stroke="#2a1810" strokeWidth="1.1"/>
        <ellipse cx="55" cy="30" rx="6" ry="4" fill="none" stroke="#2a1810" strokeWidth="1"/>
        <circle cx="56" cy="29" r="1" fill="#2a1810"/>
      </g>
    ),
    jurassic: (
      <g>
        <path d="M10,50 Q15,45 25,48 L35,52 Q45,55 55,52 Q65,55 75,48 Q82,45 85,50 L80,54 Q78,58 82,62 L75,60 Q70,63 65,58 Q55,62 45,58 Q35,62 25,58 L15,60 Q12,55 10,50" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <circle cx="82" cy="49" r="1.5" fill="#2a1810"/>
        <line x1="40" y1="55" x2="40" y2="48" stroke="#2a1810" strokeWidth="0.6"/>
        <line x1="45" y1="55" x2="45" y2="46" stroke="#2a1810" strokeWidth="0.6"/>
        <line x1="50" y1="55" x2="50" y2="47" stroke="#2a1810" strokeWidth="0.6"/>
      </g>
    ),
    cretaceous: (
      <g>
        <path d="M20,55 L28,45 Q35,35 50,38 Q62,35 72,45 L72,55 L76,60 L72,62 L68,65 L65,70 L60,70 L58,65 L45,68 L42,72 L35,72 L35,68 L22,65 Z" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <line x1="65" y1="42" x2="65" y2="32" stroke="#2a1810" strokeWidth="1"/>
        <circle cx="65" cy="30" r="4" fill="none" stroke="#2a1810" strokeWidth="1"/>
        <line x1="62" y1="48" x2="58" y2="45" stroke="#2a1810" strokeWidth="0.8"/>
        <line x1="65" y1="48" x2="65" y2="44" stroke="#2a1810" strokeWidth="0.8"/>
        <line x1="68" y1="48" x2="72" y2="45" stroke="#2a1810" strokeWidth="0.8"/>
      </g>
    ),
    paleogene: (
      <g>
        <ellipse cx="50" cy="55" rx="25" ry="15" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <path d="M30,52 Q25,45 30,40 M35,48 Q32,42 36,38" stroke="#2a1810" strokeWidth="0.9" fill="none"/>
        <circle cx="32" cy="50" r="1.3" fill="#2a1810"/>
        <line x1="70" y1="60" x2="82" y2="65" stroke="#2a1810" strokeWidth="0.9"/>
        <line x1="42" y1="70" x2="40" y2="78" stroke="#2a1810" strokeWidth="0.9"/>
        <line x1="58" y1="70" x2="60" y2="78" stroke="#2a1810" strokeWidth="0.9"/>
      </g>
    ),
    neogene: (
      <g>
        <circle cx="50" cy="40" r="12" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <circle cx="45" cy="38" r="1.2" fill="#2a1810"/>
        <circle cx="55" cy="38" r="1.2" fill="#2a1810"/>
        <path d="M45,44 Q50,47 55,44" stroke="#2a1810" strokeWidth="0.8" fill="none"/>
        <path d="M40,52 L38,68 L42,78 M60,52 L62,68 L58,78" stroke="#2a1810" strokeWidth="1" fill="none"/>
        <path d="M42,58 L35,55 M58,58 L65,55" stroke="#2a1810" strokeWidth="0.9" fill="none"/>
      </g>
    ),
    quaternary: (
      <g>
        <circle cx="50" cy="35" r="10" fill="none" stroke="#2a1810" strokeWidth="1.1"/>
        <circle cx="47" cy="33" r="1" fill="#2a1810"/>
        <circle cx="53" cy="33" r="1" fill="#2a1810"/>
        <path d="M47,38 Q50,40 53,38" stroke="#2a1810" strokeWidth="0.7" fill="none"/>
        <line x1="50" y1="45" x2="50" y2="70" stroke="#2a1810" strokeWidth="1.2"/>
        <path d="M50,50 L40,58 M50,50 L60,58" stroke="#2a1810" strokeWidth="1" fill="none"/>
        <path d="M50,70 L42,82 M50,70 L58,82" stroke="#2a1810" strokeWidth="1" fill="none"/>
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {sketches[id] || sketches.cambrian}
    </svg>
  );
};

// ============ 辅助：沿路径查找 ============
const findByPath = (path) => {
  let node = { children: tree };
  const chain = [];
  for (const id of path) {
    if (!node.children) return null;
    const next = node.children.find(c => c.id === id);
    if (!next) return null;
    chain.push(next);
    node = next;
  }
  return { node: chain[chain.length - 1], chain };
};

// 从祖先链继承某属性
const inheritProp = (chain, prop, fallback) => {
  for (let i = chain.length - 1; i >= 0; i--) {
    if (chain[i][prop] !== undefined) return chain[i][prop];
  }
  return fallback;
};

// ============ 格式化年代值 ============
const formatMa = (ma) => {
  if (ma === 0) return '至今';
  if (ma < 0.01) return (ma * 1000).toFixed(1) + ' ka';
  if (ma < 1) return (ma * 1000).toFixed(0) + ' ka';
  if (ma < 10) return ma.toFixed(2) + ' Ma';
  if (ma < 100) return ma.toFixed(1) + ' Ma';
  return Math.round(ma) + ' Ma';
};

// ============ 面包屑导航 ============
const Breadcrumb = ({ chain, onNavigate }) => {
  // 给每个 level 一个槽位
  const slots = LEVEL_ORDER.map((lvl, i) => {
    const node = chain.find(c => c.level === lvl);
    return { level: lvl, node, index: chain.indexOf(node) };
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', gap: 0,
      padding: '12px 0', borderBottom: '1px solid rgba(42,24,16,0.25)',
      marginBottom: 24, fontFamily: 'Cormorant Garamond, serif',
    }}>
      {slots.map((s, i) => {
        const meta = LEVEL_META[s.level];
        const active = !!s.node;
        return (
          <div key={s.level} style={{
            display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 0,
          }}>
            <div
              onClick={active ? () => onNavigate(s.index) : undefined}
              style={{
                flex: 1, padding: '6px 10px', cursor: active ? 'pointer' : 'default',
                opacity: active ? 1 : 0.38, minWidth: 0,
                borderLeft: i === 0 ? 'none' : '1px solid rgba(42,24,16,0.15)',
              }}
              title={active ? `回到 ${meta.zh} 级别` : '未选'}
            >
              <div style={{
                fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#6b4020', fontFamily: 'Special Elite, monospace',
              }}>
                {meta.roman} · {meta.latin}
              </div>
              <div style={{
                fontSize: 17, fontWeight: 500, color: '#2a1810', marginTop: 2,
                fontFamily: 'Noto Serif SC, serif', whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {s.node ? s.node.name : '—'}
              </div>
              {s.node && (
                <div style={{
                  fontSize: 10, fontStyle: 'italic', color: '#6b4020', marginTop: 1,
                  fontFamily: 'Cormorant Garamond, serif',
                }}>
                  {s.node.nameLatin}
                </div>
              )}
            </div>
</div>
  );
}
    if (node.pattern) return `url(#pat-${node.pattern})`;
    return 'url(#pat-marine)';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 标尺标题 */}
      <div style={{
        fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#6b4020', fontFamily: 'Special Elite, monospace', marginBottom: 10,
        paddingLeft: 4,
      }}>
        Stratigraphic Column · 地层柱
      </div>

      <div style={{
        position: 'relative', marginLeft: 32, borderLeft: '1.5px solid #2a1810',
        borderRight: '1.5px solid #2a1810', background: 'rgba(42,24,16,0.02)',
      }}>
        {siblings.map((node, idx) => {
          const h = heights[idx];
          const isSelected = node.id === selectedId;
          const nodePattern = node.pattern
            ? `url(#pat-${node.pattern})`
            : (inheritProp(chain, 'pattern', null)
              ? `url(#pat-${inheritProp(chain, 'pattern', 'marine')})`
              : 'url(#pat-marine)');
          const nodeColor = node.color || inheritProp(chain, 'color', '#8b7355');

          return (
            <div
              key={node.id}
              onClick={() => onSelect(node.id)}
              onDoubleClick={() => node.children && node.children.length > 0 && onDrill(node.id)}
              style={{
                position: 'relative', height: h, cursor: 'pointer',
                borderBottom: idx < siblings.length - 1 ? '0.5px solid rgba(42,24,16,0.4)' : 'none',
                transition: 'transform 0.15s',
                transform: isSelected ? 'translateX(3px)' : 'translateX(0)',
              }}
              title={node.children && node.children.length > 0 ? '双击进入下一级' : ''}
            >
              {/* 地层填充 */}
              <div style={{
                position: 'absolute', inset: 0, color: nodeColor,
                background: nodePattern,
              }}/>
              {/* 左侧年代标签 */}
              <div style={{
                position: 'absolute', left: -36, top: -6, width: 34, textAlign: 'right',
                fontSize: 9, fontFamily: 'Special Elite, monospace', color: '#2a1810',
              }}>
                {formatMa(node.startMa)}
              </div>
              {idx === siblings.length - 1 && (
                <div style={{
                  position: 'absolute', left: -36, bottom: -6, width: 34, textAlign: 'right',
                  fontSize: 9, fontFamily: 'Special Elite, monospace', color: '#2a1810',
                }}>
                  {formatMa(node.endMa)}
                </div>
              )}
              {/* 选中标记 */}
              {isSelected && (
                <>
                  <div style={{
                    position: 'absolute', left: -8, top: '50%', width: 12, height: 12,
                    background: '#8b3a1a', borderRadius: '50%', transform: 'translateY(-50%)',
                    boxShadow: '0 0 0 2px #e8dcc4',
                  }}/>
                  <div style={{
                    position: 'absolute', right: -8, top: '50%', width: 0, height: 0,
                    borderLeft: '8px solid #8b3a1a', borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent', transform: 'translateY(-50%)',
                  }}/>
                </>
              )}
              {/* 名称 */}
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                paddingLeft: 14, paddingRight: 8,
              }}>
                <div style={{
                  fontFamily: 'Noto Serif SC, serif',
                  fontSize: Math.min(18, Math.max(12, h * 0.36)),
                  fontWeight: 600, color: '#2a1810',
                  textShadow: '0 0 4px rgba(232,220,196,0.7)',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {node.name}
                </div>
              </div>
              {/* 子级提示 */}
              {node.children && node.children.length > 0 && (
                <div style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 14, color: '#2a1810', opacity: 0.5,
                  fontFamily: 'Special Elite, monospace',
                }}>
                  ▸{node.children.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div style={{
        marginTop: 14, marginLeft: 32, fontSize: 10, fontStyle: 'italic',
        color: '#6b4020', fontFamily: 'Cormorant Garamond, serif',
      }}>
        单击选中 · 双击进入下一级 · ▸n 表示含 n 个子层
      </div>
    </div>
  );
};

// ============ 详情面板 ============
const DetailPane = ({ node, chain, onDrillIn, onDrillOut }) => {
  if (!node) return null;
  const meta = LEVEL_META[node.level];
  const hasChildren = node.children && node.children.length > 0;
  const canDrillOut = chain.length > 1;

  // 继承的属性
  const sketchId = inheritProp(chain, 'sketchId', null);
  const color = inheritProp(chain, 'color', '#8b7355');

  return (
    <div style={{ position: 'relative', minHeight: 600 }}>
      {/* 右上角：层级标签 */}
      <div style={{
        position: 'absolute', right: 0, top: -4, textAlign: 'right',
        fontFamily: 'Special Elite, monospace',
      }}>
        <div style={{
          fontSize: 26, color: color, opacity: 0.85, lineHeight: 1,
        }}>
          {meta.roman}
        </div>
        <div style={{
          fontSize: 9, letterSpacing: '0.2em', color: '#6b4020', marginTop: 4,
        }}>
          LEVEL {meta.latin.toUpperCase()}
        </div>
        <div style={{
          fontSize: 11, color: '#2a1810', marginTop: 1, fontFamily: 'Noto Serif SC, serif',
        }}>
          {meta.zh}
        </div>
      </div>

      {/* 主标题 */}
      <div style={{ paddingRight: 100 }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontStyle: 'italic',
          color: '#6b4020', letterSpacing: '0.05em',
        }}>
          {node.nameLatin} · {formatMa(node.startMa)} — {formatMa(node.endMa)}
        </div>
        <h1 style={{
          fontFamily: 'Noto Serif SC, serif',
          fontSize: Math.min(meta.titleSize, 64), fontWeight: 700,
          color: '#2a1810', margin: '6px 0 12px 0', lineHeight: 1.05,
          letterSpacing: '0.02em',
        }}>
          {node.name}
        </h1>
        {node.tagline && (
          <div style={{
            fontFamily: 'Ma Shan Zheng, cursive',
            fontSize: 26, color: '#8b3a1a', marginBottom: 16,
            letterSpacing: '0.1em',
          }}>
            — {node.tagline} —
          </div>
        )}
      </div>

      {/* 装饰分隔线 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 24px 0',
      }}>
        <div style={{ flex: 1, height: 1, background: '#2a1810', opacity: 0.4 }}/>
        <div style={{
          fontSize: 13, fontStyle: 'italic', color: '#6b4020',
          fontFamily: 'Cormorant Garamond, serif',
        }}>
          {formatMa(node.startMa - node.endMa === 0 ? node.startMa : node.startMa - node.endMa)} 跨度
        </div>
        <div style={{ flex: 1, height: 1, background: '#2a1810', opacity: 0.4 }}/>
      </div>

      {/* 内容区 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: sketchId && (node.level === 'eon' || node.level === 'era' || node.level === 'period') ? '1fr 140px' : '1fr',
        gap: 24, marginBottom: 28,
      }}>
        <div>
          {/* 重要事件 */}
          {node.events && node.events.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#8b3a1a', marginBottom: 10,
                fontFamily: 'Special Elite, monospace',
              }}>
                ◆ 重要事件 · Key Events
              </div>
              <ul style={{
                margin: 0, paddingLeft: 0, listStyle: 'none',
                fontFamily: 'Noto Serif SC, serif', fontSize: 14.5, lineHeight: 1.8,
                color: '#2a1810',
              }}>
                {node.events.map((e, i) => (
                  <li key={i} style={{
                    paddingLeft: 22, position: 'relative', marginBottom: 4,
                  }}>
                    <span style={{
                      position: 'absolute', left: 0, color: '#8b3a1a',
                      fontFamily: 'Special Elite, monospace', fontSize: 13,
                    }}>
                      §{String(i+1).padStart(2, '0')}
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 生物群落 */}
          {node.species && (
            <div style={{ marginBottom: 22 }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#8b3a1a', marginBottom: 10,
                fontFamily: 'Special Elite, monospace',
              }}>
                ◆ 代表生物 · Representative Species
              </div>
              <div style={{
                fontFamily: 'Noto Serif SC, serif', fontSize: 14.5, lineHeight: 1.7,
                color: '#2a1810', fontWeight: 500,
              }}>
                {node.species}
              </div>
            </div>
          )}

          {/* 手写笔记 */}
          {node.notes && (
            <div style={{
              marginBottom: 22, padding: '16px 18px',
              border: '1px dashed rgba(42,24,16,0.35)',
              background: 'rgba(139,58,26,0.04)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -8, left: 16, padding: '0 8px',
                background: '#e8dcc4', fontSize: 10, letterSpacing: '0.2em',
                color: '#6b4020', fontFamily: 'Special Elite, monospace',
              }}>
                field notes
              </div>
              <div style={{
                fontFamily: 'Ma Shan Zheng, cursive',
                fontSize: 17, lineHeight: 1.85, color: '#2a1810',
                letterSpacing: '0.05em',
              }}>
                {node.notes}
              </div>
            </div>
          )}

          {/* 温度 */}
          {node.temperature && (
            <div style={{
              display: 'inline-block', padding: '6px 14px',
              background: 'rgba(139,58,26,0.1)',
              border: '1px solid rgba(139,58,26,0.35)',
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontSize: 14, color: '#2a1810',
            }}>
              平均温度：{node.temperature}
            </div>
          )}

          {/* 子级列表 */}
          {hasChildren && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#8b3a1a', marginBottom: 10,
                fontFamily: 'Special Elite, monospace',
              }}>
                ◆ 下级划分 · {LEVEL_META[node.children[0].level].latin} ({node.children.length})
              </div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8,
                fontFamily: 'Noto Serif SC, serif', fontSize: 13,
              }}>
                {node.children.map((c, i) => (
                  <span key={c.id} style={{
                    padding: '3px 10px', border: '1px solid rgba(42,24,16,0.3)',
                    background: 'rgba(42,24,16,0.03)', color: '#2a1810',
                  }}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 速写 */}
        {sketchId && (node.level === 'eon' || node.level === 'era' || node.level === 'period') && (
          <div style={{
            border: '1px solid rgba(42,24,16,0.4)', padding: 10,
            background: 'rgba(232,220,196,0.5)', height: 'fit-content',
            textAlign: 'center',
          }}>
            <SpeciesSketch id={sketchId} size={120} />
            <div style={{
              fontSize: 9, fontFamily: 'Special Elite, monospace',
              color: '#6b4020', letterSpacing: '0.15em', marginTop: 4,
              textTransform: 'uppercase',
            }}>
              Sketch № {chain.findIndex(c=>c.sketchId===sketchId)+1 || 1}
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div style={{
        display: 'flex', gap: 12, marginTop: 32, paddingTop: 20,
        borderTop: '1px solid rgba(42,24,16,0.25)',
      }}>
        {canDrillOut && (
          <button onClick={onDrillOut} style={btnStyle(false)}>
            ← 返回 {LEVEL_META[chain[chain.length-2].level].zh} 级
          </button>
        )}
        {hasChildren && (
          <button onClick={onDrillIn} style={btnStyle(true)}>
            进入 {LEVEL_META[node.children[0].level].zh} 级 →
          </button>
        )}
      </div>
    </div>
  );
};

const btnStyle = (primary) => ({
  padding: '10px 20px',
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: 15,
  fontStyle: 'italic',
  color: primary ? '#e8dcc4' : '#2a1810',
  background: primary ? '#2a1810' : 'transparent',
  border: '1px solid #2a1810',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  transition: 'all 0.2s',
});

// ============ 主应用 ============
export default function App() {
  // 默认路径：显生宙（让用户先看到四个宙）
  const [path, setPath] = useState(['phanerozoic']);

  // 计算当前节点链
  const result = useMemo(() => findByPath(path), [path]);
  const currentNode = result?.node;
  const chain = result?.chain || [];

  // 当前层级的兄弟节点
  const siblings = useMemo(() => {
    if (path.length <= 1) return tree;
    const parentResult = findByPath(path.slice(0, -1));
    return parentResult?.node?.children || tree;
  }, [path]);

  // 处理器
  const selectSibling = (id) => {
    setPath([...path.slice(0, -1), id]);
  };

  const drillIn = () => {
    if (currentNode?.children?.length > 0) {
      setPath([...path, currentNode.children[0].id]);
    }
  };

  const drillOut = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  const navigateToLevel = (idx) => {
    if (idx >= 0 && idx < path.length) {
      setPath(path.slice(0, idx + 1));
    }
  };

  if (!currentNode) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at 20% 30%, #f0e4cb 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, #d9ccb0 0%, transparent 50%),
        #e8dcc4
      `,
      padding: '32px 20px 60px',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#2a1810',
      position: 'relative',
    }}>
      <PaperTexture />
      <StratumPatterns />

      <div style={{
        maxWidth: 1280, margin: '0 auto', position: 'relative',
        background: 'rgba(232,220,196,0.4)',
        padding: '40px 48px',
        boxShadow: 'inset 0 0 80px rgba(90,58,32,0.15), 0 4px 30px rgba(42,24,16,0.15)',
      }}>
        {/* 装饰墨点 */}
        <svg style={{
          position: 'absolute', top: 20, right: 20, width: 50, height: 50,
          opacity: 0.6, pointerEvents: 'none',
        }} viewBox="0 0 100 100">
          <InkBlot cx={50} cy={50} r={16} seed={3} opacity={0.4}/>
          <InkBlot cx={65} cy={65} r={5} seed={7} opacity={0.6}/>
        </svg>

        {/* 顶部标题栏 */}
        <header style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 24, marginBottom: 20, paddingBottom: 20,
          borderBottom: '2px double #2a1810',
        }}>
          <div>
            <div style={{
              fontSize: 10, letterSpacing: '0.3em', color: '#6b4020',
              fontFamily: 'Special Elite, monospace', marginBottom: 6,
            }}>
              FIELD NOTEBOOK · VOL. Ⅱ · REV. 2026
            </div>
            <h1 style={{
              margin: 0, fontSize: 48, fontWeight: 700,
              fontFamily: 'Noto Serif SC, serif', color: '#2a1810',
              letterSpacing: '0.05em', lineHeight: 1.1,
            }}>
              地质学田野手记
            </h1>
            <div style={{
              fontSize: 18, fontStyle: 'italic', color: '#6b4020',
              fontFamily: 'Cormorant Garamond, serif', marginTop: 4,
            }}>
              Chronica Telluris — 六级年代体系<span style={{margin:'0 8px'}}>·</span>
              <span style={{fontFamily:'Noto Serif SC, serif', fontStyle:'normal'}}>
                宙 · 代 · 纪 · 世 · 期 · 时
              </span>
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CompassRose size={80}/>
            <div style={{
              fontSize: 9, letterSpacing: '0.2em', color: '#6b4020',
              fontFamily: 'Special Elite, monospace', marginTop: 4,
            }}>
              4.6 Ga — 0 Ma
            </div>
          </div>
        </header>

        {/* 面包屑 */}
        <Breadcrumb chain={chain} onNavigate={navigateToLevel} />

        {/* 主体网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 48,
          alignItems: 'start',
        }}>
          <StratigraphicColumn
            siblings={siblings}
            selectedId={path[path.length - 1]}
            onSelect={selectSibling}
            onDrill={(id) => {
              // 先选中，然后钻入
              const newPath = [...path.slice(0, -1), id];
              const r = findByPath(newPath);
              if (r?.node?.children?.length > 0) {
                setPath([...newPath, r.node.children[0].id]);
              }
            }}
            chain={chain.slice(0, -1)}
          />
          <DetailPane
            node={currentNode}
            chain={chain}
            onDrillIn={drillIn}
            onDrillOut={drillOut}
          />
        </div>

        {/* 页脚 */}
        <footer style={{
          marginTop: 48, paddingTop: 20,
          borderTop: '1px solid rgba(42,24,16,0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, color: '#6b4020', fontFamily: 'Special Elite, monospace',
          letterSpacing: '0.15em',
        }}>
          <div>依据 ICS 国际地层委员会 2023 地质年代表</div>
          <div style={{ fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: 13, letterSpacing: '0.05em' }}>
            stratum ordinatum — 层序有律
          </div>
          <div>
            当前路径深度：{path.length} / 6
          </div>
        </footer>
      </div>
    </div>
  );
}
