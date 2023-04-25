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
                            <el-upload
                                drag
                                :action="API+'record-files/'"
                                multiple
                            >
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    Drop file here or <em>click to upload</em>
                                </div>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        jpg/png files with a size less than 500kb
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

        <div>
            <el-table :data="data" style="width: 100%">
                <el-table-column prop="records" label="records" width="180" />
                <el-table-column prop="label" label="label" width="180" />
                <el-table-column prop="label" label="test" />
            </el-table>
        </div>
    </div>
</template>


<style>
    .m-2{
        margin:0 10px;
    }
</style>


<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                drawer:false,
                recordTab:'files',
                textContent:"",

                code:this.$route.params.code,
                codeExist:false,
                data:[],
                API:'http://localhost:8082/api/',
            }
        },
        created() {
            this.extractRecords();
        },
        methods:{
            goBack() {
                window.history.back();
            },
            recordTextContent() {
                const url = this.API+'record-text/';
                const upData = {"content":encodeURI(this.textContent)}
                axios.post(url, upData).then((res)=>{
                    if (res.data.result) {
                        alert("文本记录成功");
                        this.textContent = "";
                    }else {
                        alert(decodeURI(res.data.result));
                    }
                }).catch((err)=>{
                    alert("文本记录失败"+err);
                });
            },
            async extractRecords() {
                await this.verifyCodeExist()
                if (this.codeExist) {
                    this.getData();
                }else{
                    alert("未知空间。");
                    this.goBack();
                }
            },
            async verifyCodeExist() {
                const url = this.API+'verify-code/'+this.code;
                await axios.get(url).then((res)=>{
                    if (res.data.result) {
                        this.codeExist = true;
                    }
                })
            },
            getData() {
                const url = this.API+'extract-records/'+this.code;
                axios.get(url).then((res)=>{
                    this.data = res.data;
                })
            }
        }
    } 
</script>