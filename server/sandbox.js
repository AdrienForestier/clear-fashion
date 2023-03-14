/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimart = require('./eshops/montlimart');
const circleSportsWear = require('./eshops/circlesportswear');

const [,, eshop] = process.argv;
var brand="";
if(eshop.includes('dedicatedbrand')){brand='dedicatedBrand';}
else if(eshop.includes('montlimart')){brand='montlimartBrand';}
else if(eshop.includes('circlesportswear')){brand='circleSportsWearBrand';}

switch (brand){
  case "dedicatedBrand":
    async function sandboxD (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
      try {
        console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
        const products = await dedicatedbrand.scrape(eshop);
        console.log(products);
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }
    sandboxD(eshop);
    break;
  case 'montlimartBrand':
    async function sandboxM (eshop = 'https://www.montlimart.com/') {
      try {
        console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
        const products = await montlimart.scrape(eshop);
        console.log(products);
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }
    sandboxM(eshop);
    break;
  case 'circleSportsWearBrand':
    async function sandboxC (eshop = 'https://shop.circlesportswear.com/') {
      try {
        console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
        const products = await circleSportsWear.scrape(eshop);
        console.log(products);
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }
    sandboxC(eshop);
    break;

  default:
    console.log('Brand not included.')
    break;
}
