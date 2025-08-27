import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDemoCards() {
  try {
    console.log('Seeding demo business cards...');

    // Create demo user if not exists
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo1@example.com' },
      update: {},
      create: {
        email: 'demo1@example.com',
        name: 'Demo User 1',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      }
    });

    // Demo Card 1: Tech CEO
    const techCard = await prisma.businessCard.create({
      data: {
        name: '陳志明',
        position: '執行長',
        company: '智慧科技有限公司',
        email: 'chen.zhiming@smarttech.com',
        phone: '+886 2 2345 6789',
        officePhone: '+886 2 2345 6790',
        website: 'https://smarttech.com',
        address: '台北市信義區信義路五段7號',
        bio: '擁有15年科技產業經驗，專注於人工智能和雲端解決方案。致力於推動企業數位轉型，幫助客戶在數位時代保持競爭力。',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 1250,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/chen-zhiming' },
            { platform: 'website', url: 'https://smarttech.com' }
          ]
        },
        products: {
          create: [
            {
              name: 'AI 智能分析平台',
              description: '基於機器學習的數據分析和預測平台，幫助企業做出更明智的決策。'
            },
            {
              name: '雲端解決方案',
              description: '企業級雲端服務，提供安全、穩定、高效的雲端基礎設施。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '資訊技術 (Information Technology)' },
            { tag: '創意設計 (Creative Design)' },
            { tag: '行銷與內容 (Marketing & Content)' }
          ]
        }
      }
    });

    // Demo Card 2: Financial Consultant
    const financeCard = await prisma.businessCard.create({
      data: {
        name: '林美華',
        position: '財務顧問',
        company: '卓越財富管理顧問公司',
        email: 'lin.meihua@excellentwealth.com',
        phone: '+886 2 2777 8888',
        officePhone: '+886 2 2777 8889',
        website: 'https://excellentwealth.com',
        address: '台北市大安區忠孝東路四段169號',
        bio: '專業財務規劃師，擁有CPA和CFP認證。專精於個人財務規劃、投資組合管理和風險評估，致力於為客戶創造長期財富價值。',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 890,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/lin-meihua' },
            { platform: 'facebook', url: 'https://facebook.com/lin.meihua' }
          ]
        },
        products: {
          create: [
            {
              name: '個人財務規劃',
              description: '量身定制的個人財務規劃方案，包含投資、保險、稅務等全方位規劃。'
            },
            {
              name: '投資組合管理',
              description: '專業投資組合建議和管理，根據客戶風險承受度制定最適投資策略。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '金融保險 (Finance & Insurance)' },
            { tag: '法律與會計 (Legal & Accounting)' },
            { tag: '其他服務業 (Other Services)' }
          ]
        }
      }
    });

    // Demo Card 3: Design Creative Director
    const designCard = await prisma.businessCard.create({
      data: {
        name: '王創意',
        position: '創意總監',
        company: '無限設計工作室',
        email: 'wang.chuangyi@infinitedesign.com',
        phone: '+886 2 2888 9999',
        officePhone: '+886 2 2889 0000',
        website: 'https://infinitedesign.com',
        address: '台北市中山區南京東路二段100號',
        bio: '資深設計師，專注於品牌視覺設計和用戶體驗設計。曾獲得多項國際設計大獎，作品風格簡約現代，注重細節和用戶需求。',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 1567,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'instagram', url: 'https://instagram.com/wang.chuangyi' },
            { platform: 'behance', url: 'https://behance.net/wang.chuangyi' },
            { platform: 'website', url: 'https://infinitedesign.com' }
          ]
        },
        products: {
          create: [
            {
              name: '品牌視覺設計',
              description: '從品牌標誌到完整視覺識別系統，打造獨特的品牌形象。'
            },
            {
              name: 'UI/UX 設計',
              description: '用戶介面和用戶體驗設計，創造直觀、美觀且易用的數位產品。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '創意設計 (Creative Design)' },
            { tag: '媒體製作 (Media Production)' },
            { tag: '資訊技術 (Information Technology)' }
          ]
        }
      }
    });

    // Demo Card 4: Real Estate Agent
    const realEstateCard = await prisma.businessCard.create({
      data: {
        name: '李美玲',
        position: '資深房地產顧問',
        company: '信義房屋',
        email: 'li.meiling@xinyi.com',
        phone: '+886 2 2712 3456',
        officePhone: '+886 2 2712 3457',
        website: 'https://xinyi.com',
        address: '台北市大安區敦化南路二段65號',
        bio: '專業房地產顧問，擁有10年行業經驗。專精於住宅物業買賣、投資物業分析和市場趨勢預測，致力於為客戶找到最適合的房地產解決方案。',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 2100,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'facebook', url: 'https://facebook.com/li.meiling' },
            { platform: 'line', url: 'https://line.me/ti/p/li.meiling' }
          ]
        },
        products: {
          create: [
            {
              name: '住宅買賣服務',
              description: '提供專業的住宅物業買賣諮詢，從房源搜尋到交易完成全程服務。'
            },
            {
              name: '投資物業分析',
              description: '為投資者提供詳細的物業投資分析和回報率預測。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '房地產業務 (Real Estate)' },
            { tag: '其他服務業 (Other Services)' },
            { tag: '金融保險 (Finance & Insurance)' }
          ]
        }
      }
    });

    // Demo Card 5: Healthcare Professional
    const healthcareCard = await prisma.businessCard.create({
      data: {
        name: '張醫師',
        position: '專科醫師',
        company: '仁愛醫院',
        email: 'dr.zhang@renai.hospital',
        phone: '+886 2 2891 2345',
        officePhone: '+886 2 2891 2346',
        website: 'https://renai.hospital',
        address: '台北市中正區中山南路7號',
        bio: '資深專科醫師，專注於內科疾病診斷和治療。擁有豐富的臨床經驗，致力於為患者提供最優質的醫療服務和健康諮詢。',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 1890,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'website', url: 'https://renai.hospital/dr-zhang' }
          ]
        },
        products: {
          create: [
            {
              name: '專科門診',
              description: '提供專業的內科疾病診斷和治療服務。'
            },
            {
              name: '健康諮詢',
              description: '個人化健康管理和疾病預防諮詢服務。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '醫療健康 (Healthcare)' },
            { tag: '其他服務業 (Other Services)' },
            { tag: '教育與輔導 (Education and Tutoring)' }
          ]
        }
      }
    });

    // Demo Card 6: Automotive Sales
    const automotiveCard = await prisma.businessCard.create({
      data: {
        name: '王志豪',
        position: '汽車銷售顧問',
        company: '和泰汽車',
        email: 'wang.zhihao@hotai.com.tw',
        phone: '+886 2 2696 8888',
        officePhone: '+886 2 2696 8889',
        website: 'https://hotai.com.tw',
        address: '台北市內湖區瑞光路513巷12號',
        bio: '專業汽車銷售顧問，擁有8年汽車銷售經驗。熟悉各種車型性能和配置，致力於為客戶提供最適合的汽車選購方案和優質的售後服務。',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        isPublic: true,
        viewCount: 1450,
        userId: demoUser.id,
        socialLinks: {
          create: [
            { platform: 'facebook', url: 'https://facebook.com/wang.zhihao' },
            { platform: 'line', url: 'https://line.me/ti/p/wang.zhihao' }
          ]
        },
        products: {
          create: [
            {
              name: '新車銷售',
              description: '提供各品牌新車銷售和試駕服務。'
            },
            {
              name: '汽車貸款諮詢',
              description: '為客戶提供最優惠的汽車貸款方案。'
            }
          ]
        },
        industryTags: {
          create: [
            { tag: '汽車銷售 (Automotive Sales)' },
            { tag: '金融保險 (Finance & Insurance)' },
            { tag: '其他服務業 (Other Services)' }
          ]
        }
      }
    });

    console.log('Demo cards created successfully:');
    console.log(`1. ${techCard.name} - ${techCard.company}`);
    console.log(`2. ${financeCard.name} - ${financeCard.company}`);
    console.log(`3. ${designCard.name} - ${designCard.company}`);
    console.log(`4. ${realEstateCard.name} - ${realEstateCard.company}`);
    console.log(`5. ${healthcareCard.name} - ${healthcareCard.company}`);
    console.log(`6. ${automotiveCard.name} - ${automotiveCard.company}`);

  } catch (error) {
    console.error('Error seeding demo cards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoCards()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });