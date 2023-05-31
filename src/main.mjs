import configFile from './helper/file/config_file.mjs'
import outputCheckpoint from './helper/checkpoint/output_checkpoint.mjs'
import outputCache from './helper/cache/output_cache.mjs'
import outputMarkdown from './helper/markdown/output_markdown.mjs'
import outputHtml from './helper/html/output_html.mjs'
import createHtmlFile from './helper/html/file/create_html_file.mjs'
import createRankingJsonFile from './helper/html/file/create_ranking_json_file.mjs'
import createIndexPage from './helper/markdown/page/create_index_page.mjs'
import createPublicContributionsPage from './helper/markdown/page/create_public_contributions_page.mjs'
import createTotalContributionsPage from './helper/markdown/page/create_total_contributions_page.mjs'
import createFollowersPage from './helper/markdown/page/create_followers_page.mjs'
import requestOctokit from './helper/octokit/request_octokit.mjs'
//const formatMarkdown = require('./helper/markdown/format_markdown');
import OutputMarkdownModel from './model/markdown/OutputMarkdownModel.mjs'

//let Index = function () {
    const AUTH_KEY = process.env.CUSTOM_TOKEN || "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";
    const GITHUB_USERNAME_AND_REPOSITORY = process.env.GITHUB_REPOSITORY || "your-username/repository-name";
    const MAXIMUM_ERROR_ITERATIONS = 4;

    //for(let i = 0; i < 50; i++) {
       /* let getCheckpoint = async function (locationsArray, country, checkpoint) {
            let indexOfTheCountry = locationsArray.findIndex(location => location.country === country);
            /*if(indexOfTheCountry === i){
                console.log("checkpoint set", country)
                return true;
            } else {
                console.log("checkpoint not set", country)
                return false;
            }*/

         /*   return true;
        }*/
        let saveCache = async function (readConfigResponseModel, readCheckpointResponseModel) {
            console.log(`########## SaveCache ##########`)
            for await(const locationDataModel of readConfigResponseModel.locations){
               // let isCheckpoint = await getCheckpoint(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint);
               // if(isCheckpoint){
                
                    let json = await requestOctokit.request(AUTH_KEY, MAXIMUM_ERROR_ITERATIONS, locationDataModel.locations);
                    let readCacheResponseModel =  await outputCache.readCacheFile(locationDataModel.country);
                    if(readCacheResponseModel.status){
                        if(readCacheResponseModel.users.length > json.length){
                            console.log(`octokit error cache:${readCacheResponseModel.users.length} octokit:${json.length}`);
                        } else {
                            console.log(`request success cache:${readCacheResponseModel.users.length} octokit:${json.length}`);
                            await outputCache.saveCacheFile(locationDataModel.country, json);
                        }
                    } else {
                        console.log(`request success octokit:${json.length}`);
                        await outputCache.saveCacheFile(locationDataModel.country, json);
                    }
              //  }
            }
        }
        let saveMarkdown = async function (readConfigResponseModel, readCheckpointResponseModel) {
            console.log(`########## SaveMarkDown ##########`)
            for await(const locationDataModel of readConfigResponseModel.locations){
                //let isCheckpoint = await getCheckpoint(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint)
                //if(isCheckpoint){
                    let readCacheResponseModel =  await outputCache.readCacheFile(locationDataModel.country);
                    if(readCacheResponseModel.status) {
                        let outputMarkdownModel =  new OutputMarkdownModel(GITHUB_USERNAME_AND_REPOSITORY, locationDataModel, readCacheResponseModel, readConfigResponseModel);
                        await outputMarkdown.savePublicContributionsMarkdownFile(locationDataModel.country, createPublicContributionsPage.create(outputMarkdownModel));
                        await outputMarkdown.saveTotalContributionsMarkdownFile(locationDataModel.country, createTotalContributionsPage.create(outputMarkdownModel));
                        await outputMarkdown.saveFollowersMarkdownFile(locationDataModel.country, createFollowersPage.create(outputMarkdownModel));
                    }
                //}
                await outputCheckpoint.saveCheckpointFile(readConfigResponseModel.locations, locationDataModel.country, readCheckpointResponseModel.checkpoint)
            }
            if(!readConfigResponseModel.devMode) await outputMarkdown.saveIndexMarkdownFile(createIndexPage.create(GITHUB_USERNAME_AND_REPOSITORY, readConfigResponseModel));
        }
        let saveHtml = async function (readConfigResponseModel) {
            console.log(`########## SaveHtml ##########`);
            await outputHtml.saveRankingJsonFile(await createRankingJsonFile.create(readConfigResponseModel));
            await outputHtml.saveHtmlFile(createHtmlFile.create());
        }
        let main = async function () {
            let readConfigResponseModel = await configFile.readConfigFile();
            let readCheckpointResponseModel = await outputCheckpoint.readCheckpointFile();
            if(readConfigResponseModel.status && readCheckpointResponseModel.status){
                //let checkpointCountry = readConfigResponseModel.locations[readCheckpointResponseModel.checkpoint].country
                await saveCache(readConfigResponseModel, readCheckpointResponseModel);
                await saveMarkdown(readConfigResponseModel, readCheckpointResponseModel)
                await saveHtml(readConfigResponseModel)
            }
        }
      /**  return {
            main: main,
        };*/
    //}
//}();

main().then(() => {
    console.log("Success");
}).catch(() => {
    console.log("Error");
}).finally(() => {
    console.log("End");
});