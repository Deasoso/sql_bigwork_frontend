<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取教师信息</el-button>
        <!-- <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="未推送" name="nopushed"></el-tab-pane>
            <el-tab-pane label="已推送" name="pushed"></el-tab-pane>
        </el-tabs> -->
        <!-- 显示教师表格 -->
        <div class="table_container">
            <el-table
                :data="showteatableData"
                ref="teatable"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="身份证照片">
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[0]">
                            </img>
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[1]">
                            </img>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                        <el-form-item label="学生证照片">
                            <span v-for="item,index in props.row.picurls.stuarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.stuarr[index]">
                                </img>
                            </span>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                        <el-form-item label="教师证照片">
                            <span v-for="item,index in props.row.picurls.teaarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.teaarr[index]">
                                </img>
                            </span>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                        <el-form-item label="自我介绍">
                            <span>{{ props.row.introduce }}</span>
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓"
                  prop="firstname">
                </el-table-column>
                <el-table-column
                  label="名"
                  prop="lastname">
                </el-table-column>
                <el-table-column
                  label="推送情况"
                  prop="pushed">
                </el-table-column>
                <el-table-column
                  label="手机号"
                  prop="wxnum">
                </el-table-column>
                <el-table-column
                  label="余额"
                  prop="balance">
                </el-table-column>
                <el-table-column
                  label="提现金额"
                  prop="withdraw">
                </el-table-column>
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="withdraw(scope.row.onlyid, scope.row.withdraw)">全部确认提现</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="teacurrentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
const axios = require("axios");
import headTop from "../components/headTop";
import { SIGUSR1 } from "constants";
export default {
  data() {
    return {
      activeName: "all",
      offset: 0,
      limit: 20,
      count: 1,
      teatableData: [],
      showteatableData: [],
      teacurrentPage: 1,
      headertoken: ""
    };
  },
  created() {},
  computed: {},
  components: {
    headTop
  },
  methods: {
    // Clicktab(e){
    //     this.activeName = e.name;
    //     if(e.name == "all"){
    //         this.showteatableData = this.teatableData;
    //         this.$refs.teatable.data = this.showteatableData;
    //     }else if(e.name == "nopushed"){
    //         this.showteatableData = this.teatableData.filter(item => item.pushed == 0)
    //         this.$refs.teatable.data = this.showteatableData;
    //     }else if(e.name == "pushed"){
    //         this.showteatableData = this.teatableData.filter(item => item.pushed == 1)
    //         this.$refs.teatable.data = this.showteatableData;
    //     }
    // },
    async initData() {
      this.getTeachers();
    },
    async getMenu() {
      console.log("获取食品种类失败", err);
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getFoods();
    },
    async withdraw(inputonlyid, inputwithdraw) {
      console.log(inputonlyid);
      console.log(inputwithdraw);
      const response = await axios.post(
        `https://api.deaso40.com/api/withdrawed`,
        {
          onlyid: inputonlyid,
          value: inputwithdraw
        },
        {
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      console.log(data);
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.$message("成功");
      }
      await this.initData();
      this.Clicktab({ name: this.activeName });
    },
    async getTeachers() {
      this.teatableData = [];
      const response = await axios.get(
        `https://api.deaso40.com/api/getallreviews`,
        {
          data: {},
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        console.log(data);
        this.teatableData = response.data.result;
        this.showteatableData = this.teatableData;
      }
      this.teatableData = this.teatableData.filter(item => item.reviewed === 2);
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
