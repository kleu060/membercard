import { db } from '../src/lib/db';

// 10 fake business cards with diverse industries and locations
const testCards = [
  {
    name: '李明華',
    company: '科技創新有限公司',
    position: '首席技術官',
    phone: '+852-2345-6789',
    email: 'liminghua@techinnov.com',
    website: 'https://techinnov.com',
    bio: '擁有15年軟件開發經驗，專注於人工智能和雲計算解決方案。',
    location: '香港',
    industryTags: ['科技 (Technology)', '人工智能 (AI)', '雲計算 (Cloud Computing)'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/liminghua' },
      { platform: 'website', url: 'https://techinnov.com' }
    ],
    products: [
      { name: 'AI智能客服系統', description: '基於機器學習的智能客服解決方案' },
      { name: '雲端數據分析平台', description: '企業級大數據分析和可視化平台' }
    ]
  },
  {
    name: '王美玲',
    company: '環球金融投資集團',
    position: '高級投資顧問',
    phone: '+852-2987-6543',
    email: 'wangmeiling@globalfinance.com',
    website: 'https://globalfinance.com',
    bio: '專業財富管理專家，致力於為客戶提供全方位的投資理財服務。',
    location: '香港',
    industryTags: ['金融 (Finance)', '投資理財 (Investment)', '財富管理 (Wealth Management)'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/wangmeiling' },
      { platform: 'wechat', url: 'https://wechat.com/wangmeiling' }
    ],
    products: [
      { name: '投資組合管理', description: '個人化投資組合規劃和管理' },
      { name: '風險評估服務', description: '專業投資風險分析和評估' }
    ]
  },
  {
    name: '張偉強',
    company: '優質房地產發展',
    position: '資深地產代理',
    phone: '+852-2765-4321',
    email: 'zhangweiqiang@premiumrealestate.com',
    website: 'https://premiumrealestate.com',
    bio: '專業房地產顧問，精通香港各區物業市場，提供專業買賣租賃服務。',
    location: '香港',
    industryTags: ['房地產 (Real Estate)', '物業投資 (Property Investment)', '地產代理 (Real Estate Agency)'],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/zhangweiqiang' },
      { platform: 'website', url: 'https://premiumrealestate.com' }
    ],
    products: [
      { name: '住宅物業買賣', description: '香港各區住宅物業專業買賣服務' },
      { name: '商業物業租賃', description: '辦公室、商鋪等商業物業租賃服務' }
    ]
  },
  {
    name: '陳雅婷',
    company: '創意設計工作室',
    position: '創意總監',
    phone: '+886-2-2345-6789',
    email: 'chenyating@creativedesign.com',
    website: 'https://creativedesign.com',
    bio: '資深設計師，專注於品牌設計、UI/UX設計和數字營銷解決方案。',
    location: '台北',
    industryTags: ['設計 (Design)', '品牌策劃 (Branding)', 'UI/UX設計 (UI/UX Design)'],
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/chenyating' },
      { platform: 'behance', url: 'https://behance.net/chenyating' }
    ],
    products: [
      { name: '品牌識別設計', description: '企業品牌識別系統設計' },
      { name: '網站UI設計', description: '用戶界面和用戶體驗設計服務' }
    ]
  },
  {
    name: '劉志豪',
    company: '綠色能源科技有限公司',
    position: '項目經理',
    phone: '+86-10-8765-4321',
    email: 'liuzhihao@greenenergy.com',
    website: 'https://greenenergy.com',
    bio: '可再生能源專家，致力於推動可持續發展和環保技術應用。',
    location: '北京',
    industryTags: ['新能源 (New Energy)', '環保科技 (Environmental Technology)', '可持續發展 (Sustainable Development)'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/liuzhihao' },
      { platform: 'website', url: 'https://greenenergy.com' }
    ],
    products: [
      { name: '太陽能解決方案', description: '商業和住宅太陽能系統設計安裝' },
      { name: '能源管理系統', description: '智能能源監控和管理平台' }
    ]
  },
  {
    name: '黃慧敏',
    company: '國際教育諮詢中心',
    position: '教育顧問',
    phone: '+852-2543-2109',
    email: 'huanghuimin@internationaledu.com',
    website: 'https://internationaledu.com',
    bio: '專業教育顧問，擁有10年國際教育諮詢經驗，幫助學生規劃海外留學。',
    location: '香港',
    industryTags: ['教育 (Education)', '留學諮詢 (Study Abroad)', '職業培訓 (Vocational Training)'],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/huanghuimin' },
      { platform: 'wechat', url: 'https://wechat.com/huanghuimin' }
    ],
    products: [
      { name: '留學申請服務', description: '美國、英國、澳洲等國家留學申請' },
      { name: '語言培訓課程', description: '雅思、托福等語言考試培訓' }
    ]
  },
  {
    name: '周建國',
    company: '健康醫療集團',
    position: '高級醫療顧問',
    phone: '+86-21-5876-5432',
    email: 'zhoujianguo@healthcare.com',
    website: 'https://healthcare.com',
    bio: '醫療行業專家，專注於健康管理和醫療技術創新。',
    location: '上海',
    industryTags: ['醫療 (Healthcare)', '健康管理 (Health Management)', '醫療技術 (Medical Technology)'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/zhoujianguo' },
      { platform: 'website', url: 'https://healthcare.com' }
    ],
    products: [
      { name: '健康檢查套餐', description: '個人化健康檢查和評估服務' },
      { name: '遠程醫療諮詢', description: '在線醫療諮詢和健康指導' }
    ]
  },
  {
    name: '林美芬',
    company: '時尚買手精品店',
    position: '創始人兼首席買手',
    phone: '+886-2-2876-5432',
    email: 'linmeifen@fashionboutique.com',
    website: 'https://fashionboutique.com',
    bio: '時尚行業資深買手，專注於國際品牌引進和時尚趨勢分析。',
    location: '台北',
    industryTags: ['時裝 (Fashion)', '零售 (Retail)', '品牌代理 (Brand Agency)'],
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/linmeifen' },
      { platform: 'facebook', url: 'https://facebook.com/linmeifen' }
    ],
    products: [
      { name: '時裝買手服務', description: '個人化時裝搭配和採購建議' },
      { name: '品牌代理合作', description: '國際時裝品牌代理和推廣' }
    ]
  },
  {
    name: '鄭文傑',
    company: '智能製造工業',
    position: '技術研發經理',
    phone: '+86-755-8765-4321',
    email: 'zhengwenjie@smartmanufacturing.com',
    website: 'https://smartmanufacturing.com',
    bio: '工業4.0專家，專注於智能製造和自動化解決方案。',
    location: '深圳',
    industryTags: ['製造業 (Manufacturing)', '工業自動化 (Industrial Automation)', '智能製造 (Smart Manufacturing)'],
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/zhengwenjie' },
      { platform: 'website', url: 'https://smartmanufacturing.com' }
    ],
    products: [
      { name: '工業機器人', description: '智能工業機器人和自動化設備' },
      { name: '製造執行系統', description: '智能工廠管理和監控系統' }
    ]
  },
  {
    name: '吳詩婷',
    company: '旅遊文化傳播',
    position: '旅遊顧問',
    phone: '+852-2345-8765',
    email: 'wushiting@travelculture.com',
    website: 'https://travelculture.com',
    bio: '旅遊行業專家，專注於文化旅遊和定制旅遊服務。',
    location: '香港',
    industryTags: ['旅遊 (Tourism)', '文化傳播 (Cultural Communication)', '酒店管理 (Hospitality Management)'],
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/wushiting' },
      { platform: 'instagram', url: 'https://instagram.com/wushiting' }
    ],
    products: [
      { name: '定制旅遊服務', description: '個人化旅遊路線規劃和服務' },
      { name: '文化體驗活動', description: '深度文化體驗和旅遊活動策劃' }
    ]
  }
];

async function createTestCards() {
  try {
    console.log('🚀 Starting to create test business cards...');
    
    // Get the enterprise user
    const user = await db.user.findUnique({
      where: { email: 'enterprise@test.com' }
    });

    if (!user) {
      throw new Error('Enterprise user not found');
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);

    let successCount = 0;
    
    for (const cardData of testCards) {
      try {
        // Create business card with all related data
        const card = await db.businessCard.create({
          data: {
            userId: user.id,
            name: cardData.name,
            company: cardData.company,
            position: cardData.position,
            phone: cardData.phone,
            email: cardData.email,
            website: cardData.website,
            bio: cardData.bio,
            location: cardData.location,
            template: 'modern-blue',
            isPublic: true,
            socialLinks: {
              create: cardData.socialLinks || []
            },
            products: {
              create: (cardData.products || []).map((product: any) => ({
                name: product.name,
                description: product.description
              }))
            },
            industryTags: {
              createMany: {
                data: (cardData.industryTags || []).map((tag: string) => ({ tag }))
              }
            }
          },
          include: {
            socialLinks: true,
            products: true,
            industryTags: true
          }
        });

        console.log(`✅ Created card: ${cardData.name} - ${cardData.company}`);
        successCount++;
        
        // Add some random view counts to make it more realistic
        const viewCount = Math.floor(Math.random() * 100) + 1;
        await db.businessCard.update({
          where: { id: card.id },
          data: { viewCount }
        });

      } catch (error) {
        console.error(`❌ Error creating card ${cardData.name}:`, error);
      }
    }

    console.log(`\n🎉 Test card creation completed!`);
    console.log(`✅ Successfully created: ${successCount}/${testCards.length} cards`);
    console.log(`❌ Failed: ${testCards.length - successCount} cards`);
    
    console.log('\n📊 Created cards cover these industries:');
    const industries = [...new Set(testCards.flatMap(card => card.industryTags))];
    industries.forEach(industry => console.log(`  - ${industry}`));
    
    console.log('\n🌍 Created cards cover these locations:');
    const locations = [...new Set(testCards.map(card => card.location))];
    locations.forEach(location => console.log(`  - ${location}`));

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

createTestCards()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });