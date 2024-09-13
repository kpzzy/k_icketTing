// 사용 모듈 선언
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// dotenv 에서 변수 불러오기
require('dotenv').config();

// k_icket 함수 선언
const kicket = async () => {
  try {
    // headless 모드 선택
    const browser = await puppeteer.launch({
      headless: false, //
    });

    // 페이지 실행
    const page = await browser.newPage();

    // 창크기 설정
    await page.setViewport({
      width: 1366,
      height: 768,
    });

    // 내가 접근 할 페이지 // waitUntil 옵션 사용
    await page.goto(process.env.SITE_URL, {
      waitUntil: 'load',
    });

    const content = await page.content();
    const $ = cheerio.load(content);

    // 지점, 날짜, 테마, 시간을 선택
    // 지점명 (ul 태그 zizum_data 를 id 로 가지고있는 a태그를 칭함)
    const zizumData = await page.$$('ul#zizum_data a');
    // 테마명 (ul 태그 theme_data 를 id 로 가지고있는 a태그를 칭함)
    const themaData = await page.$$('ul#theme_data a');
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await page.waitForFrame({timeout: 2000})

    // 페이지 내 모든 링크를 가져옵니다.
    const links = await page.$$('a');
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const zizumArray = [];
    // 위에서 선언한 zizumData 를 순회하며 value 를 확인합니다.
    for (const zizum of zizumData) {
      const value = await page.evaluate((el) => el.textContent.trim(), zizum);
      zizumArray.push(value);
    }

    fs.writeFileSync('./config/zizumArray.txt', JSON.stringify(zizumArray));

    console.log(
      JSON.parse(fs.readFileSync('./config/zizumArray.txt', 'utf-8'))
    );

    const themeArray = [];
    for (const theme of themaData) {
      const value = await page.evaluate((el) => el.textContent.trim(), theme);
      themeArray.push(value);
    }

    console.log(themeArray, '더미어레이');

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    for (let link of links) {
      const text = await page.evaluate((el) => el.textContent.trim(), link);
      console.log(text, '텍스트란?');
      if (text === '16') {
        await link.click();
        break;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const liElements = await page.$$('li');
    for (const li of liElements) {
      const text = await page.evaluate((el) => el.textContent.trim(), li);
      if (text === '내 방') {
        await li.click(); // 텍스트가 '내 방'인 li 태그를 클릭
        console.log('Clicked on the "내 방" element.');
        break; // 클릭한 후 반복 종료
      }
    }

    const timeElements = await page.$$('li');
    for (const li of timeElements) {
      const className = await page.evaluate((el) => el.className, li);
      if (className.includes('possible')) {
        await li.click(); // 텍스트가 '내 방'인 li 태그를 클릭
        console.log('Clicked on the "내 방" element.');
        break; // 클릭한 후 반복 종료
      }
    }
    // for (const link of links) {
    //   const text = await page.evaluate((el) => el.textContent, link);
    //   if (text.includes('회원 신청하기')) {
    //     await link.click();
    //     break; // 찾았으면 반복문을 중지합니다.
    //   }
    // }
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // const span = await page.$('#certiLogin22');
    // await span.click();

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // const passwordInput = await page.$('#xwup_certselect_tek_input1');
    // await passwordInput.type('!best16775617');

    // const confirmButton = await page.$('#xwup_OkButton');
    // await confirmButton.click();
    // console.log(test)

    // const carOptions = $("#schCompany option").toArray(); // 그 드롭다운박스
    // const optionTexts = carOptions.map(option => $(option).text()); // 텍스트로 바꿔서 (이거 콘솔찍으면 회사명나옴)
    // const optionValues = $("#schCompany option").map((index, option) => $(option).attr('value')).get(); // 이거는 html 태그에 value값 추출 (이거가중요)

    // let arr = []
    // let  object = {}

    // for(let i = 0; i < optionValues.length; i++) {
    //   const selectPage = await page.select("select", optionValues[i]) // 이것은 이제 드롭다운의 n번째 항목으로 이동할것을 의미함 (드롭다운선택)
    //   await page.click('button[onclick="fnSearch(1); return false;"]'); // 이후 페이지 이동버튼을 클릭 (이동 클릭)

    //   await new Promise(resolve => setTimeout(resolve, 3000)); // 위 내용을 완료한 후 기다려야하는데 일반적인 waitForSelector 같은 옵션이 잘 작동하지 않아서 억지로 타임아웃으로 조절 (수정 필요)

    //   const newContent = await page.content();
    //   const $2 = cheerio.load(newContent);

    //   const intoTheArray = $2("div.infoBox").toArray();
    //   const getTheText = intoTheArray.map(option => $2(option).text());

    //   console.log('현재 1페이지 입니다.')
    //   console.log(getTheText)
    //   console.log('1페이지의 정보')

    //   const getThePageList = $2("div.pageList a") // 또 중요한게 클릭을 통해 페이지 이동시 $ , $2 (임의로 이렇게했지만) 를 잘 확인하여야함 그렇지 않으면 나는 기아페이지를 조회하려고하는데 대창페이지가 조회되고 그럼
    //   const pageListLength = getThePageList.length - 4

    //   console.log("페이지 리스트의 개수: ", pageListLength)

    //   if(pageListLength > 1) {
    //     for(let j = 2; j <= pageListLength; j ++){
    //       console.log(`현재 ${j}페이지 입니다.`)
    //       await page.waitForSelector(`a[id="${j}"]`)
    //       await page.click(`a[id="${j}"]`)
    //       await new Promise(resolve => setTimeout(resolve, 3000)); // 위 내용을 완료한 후 기다려야하는데 일반적인 waitForSelector 같은 옵션이 잘 작동하지 않아서 억지로 타임아웃으로 조절 (수정 필요)

    //       const newContent2 = await page.content();
    //       const $3 = cheerio.load(newContent2);

    //       await page.waitForSelector("div.infoBox")
    //       const  intoTheArray2 = $3("div.infoBox").toArray()
    //       const getTheText2 = intoTheArray2.map(option => $3(option).text());

    //       console.log(getTheText2)
    //       console.log(`${j} 페이지의 정보`)
    //     }
    //   } else {
    //     console.log('페이지리스트가 1개임')
    //   }

    // }

    // await browser.close(); // 이거가 헤드리스 true 에서 필요한 이유는 false일 시 백그라운드에 크로미윰이 계속떠있어서 리소스를 잡아먹는다고 알고있음
  } catch (error) {
    console.log(error);
  }
};

kicket();

// const batteryRegex = /배터리\s*:\s*([^\n]+?)(?=-)/i;

// const batteryMatch = text.match(batteryRegex);

// 요롷게 하는건 어덜가
