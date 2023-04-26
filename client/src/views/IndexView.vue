<template>
  <el-container>
    <el-main>
      <div class="header">
        <el-row :gutter="20" justify="center">
          <el-col :span="16" :offset="8">
            <h2>微空间-文件寄存系统</h2>
          </el-col>
          <el-divider></el-divider>
        </el-row>
      </div>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="5" :offset="8">
            <el-input 
              type="text" 
              size="large" 
              placeholder="请输入提取码" 
              v-model="code" 
              maxlength="4" 
              show-word-limit
              @keyup.enter="extractRecords"
              @keyup.shift.i="createRecords">
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button @click="extractRecords" type="primary" size="large">提取记录</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span=8 :offset="8">
            <el-link @click="createRecords" type="primary">创建记录</el-link>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import axios from 'axios';

  function extractRecords() {
    this.verifyCodeRule();
    if (this.passVerifyCodeRule) {
      this.openMainPage(this.code);
    }else{
      this.errorMessage("提取码有误！");
    }
  }

  function verifyCodeRule() {
    var regexp = /^([a-zA-Z]|[0-9]){4}$/g;
    this.passVerifyCodeRule = regexp.test(this.code);
  }

  function openMainPage(code=null) {
    window.open('/main/'+code, '_self');
  }

  function errorMessage(message) {
    alert(message);
  }

  async function createRecords() {
    try {
      await this.createCode();
      this.extractRecords();
    } catch {
      alert("服务端连接失败!");
    }
  }

  async function createCode() {
    const url = this.API+"create-records/";
    await axios.post(url).then((res)=>{
      this.code = res.data.code;
    })
  }
  
  export default {
    data() {
      return {
        API:'http://localhost:8082/api/',
        code:'',
        passVerifyCodeRule:false,
      }
    },
    methods:{
      extractRecords,
      verifyCodeRule,
      openMainPage,
      errorMessage,
      createRecords,
      createCode
    }
  }
</script>