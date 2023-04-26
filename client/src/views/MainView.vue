<template>
    <el-empty v-if="!codeExist"></el-empty>
    <div v-else>
        <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3"> 微空间 </span>
                <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                    文件寄存系统
                </span>
                <el-tag>{{ code }}</el-tag>
            </template>
            <template #extra>
                <el-button type="primary" @click="drawer = true"> 记录 </el-button>
                <el-drawer v-model="drawer" title="记录" :with-header="false">
                    <el-tabs v-model="recordTab">
                        <el-tab-pane label="文件" name="files">
                            <el-upload drag :action="API+'record-files/'+code" multiple :on-success="extractRecords">
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    拉拽文件到此处 或 <em>点击上传</em>
                                </div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        文件列表如下:
                                    </div>
                                </template>
                            </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="文本" name="text">
                            <el-input v-model="textContent" type="textarea" :rows="10"/>
                            <el-button type="sucess" style="margin:20px 0;" @click="recordTextContent"> 记录 </el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-drawer>
            </template>
        </el-page-header>
        <el-divider></el-divider>
        <div v-if="JSON.stringify(this.data) != '[]'">
            <el-space wrap :size="30" v-for="item in data" :key="item">
                <el-card class="box-card" style="margin:20px;min-width:500px">
                    <template #header>
                        <div class="card-header">
                            <el-text size="large">{{ decodeURI(item.name) }}</el-text>
                            <el-link @click="deleteRecord(code, item._id)">删除</el-link>
                        </div>
                    </template>
                    <div class="text item">
                        <div class="descript">
                            <el-text>记录时间: <small>{{ item.time }}</small></el-text>
                            <el-text>占用大小: <small>{{ (item.size/1024/1024).toFixed(3) }}M</small></el-text>
                        </div>
                        <pre v-if="item.type == 'text'">{{ item.content }}</pre>
                        <el-button class="button" type="primary" @click="downLoad(item.content)" v-else>下载该文件</el-button>
                    </div>
                </el-card>
            </el-space>
        </div>
        

        <el-empty v-else></el-empty>
    </div>
</template>
<style>
    .m-2{
        margin:0 10px;
    }

    .card-header, .descript{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    pre {
        font-size: large;
    }

    .descript {
        margin-bottom: 20px;
    }
</style>
<script>
    import axios from 'axios';

    // local action
    function goBack() {
        window.history.back();
    }

    // read records
    async function extractRecords() {
        await this.verifyCodeExist()
        if (this.codeExist) {
            this.getData();
        }else{
            alert("未知空间！");
            this.goBack();
        }
    }

    async function verifyCodeExist() {
        const url = this.API+'verify-code/'+this.code;
        await axios.get(url).then((res)=>{
            if (res.data.result) {
                this.codeExist = true;
            }
        })
    }
    
    function getData() {
        const url = this.API+'extract-records/'+this.code;
        axios.get(url).then((res)=>{
            this.data = res.data;
            this.data.forEach(element => {
                element.name = decodeURI(element.name);
                if (element.type == 'text') {
                    element.content = decodeURI(element.content);
                }
            });
        })
    }

    // write and delete records
    function recordTextContent() {
        const url = this.API+'record-text/'+this.code;
        const upData = {"content":encodeURI(this.textContent)}
        axios.post(url, upData).then((res)=>{
            if (res.data.result) {
                this.extractRecords();
                this.textContent = "";
            }else {
                alert(decodeURI(res.data.result));
            }
        }).catch((err)=>{
            alert("文本记录失败！"+err);
        });
    }

    async function deleteRecord(code, id) {
        axios.get(this.API+'delete-record/'+code+'/'+id).then((res)=>{
            if (res.data.result) {
                this.extractRecords();
            }else {
                alert("删除失败！");
            }
        })
    }

    function downLoad(url) {
        window.open(url);
    }

    export default {
        data() {
            return {
                drawer:false,
                recordTab:'files',
                textContent:"",
                API:'http://localhost:8082/api/',
                code:this.$route.params.code,
                codeExist:false,
                data:[],
            }
        },
        created() {
            this.extractRecords();
        },
        methods:{
            goBack,
            extractRecords,
            verifyCodeExist,
            getData,
            recordTextContent,
            downLoad,
            deleteRecord,
        }
    }
</script>