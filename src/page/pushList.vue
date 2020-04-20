<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取教师信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="未推送" name="nopushed"></el-tab-pane>
            <el-tab-pane label="已推送" name="pushed"></el-tab-pane>
        </el-tabs>
        <!-- 显示教师表格 -->
        <div class="table_container">
            <el-table
                :data="showteatableData"
                :row-key="row => row.id"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="地区">
                            {{props.row.area}}
                        </el-form-item>
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
                  prop="pushedtext">
                </el-table-column>
                <el-table-column
                  label="手机号"
                  prop="wxnum">
                </el-table-column>
                <el-table-column
                  label="性别"
                  prop="gender">
                </el-table-column>
                <el-table-column
                  label="科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="入学年份"
                  prop="admissionyear">
                </el-table-column>
                <el-table-column
                  label="毕业学校"
                  prop="graduationschool">
                </el-table-column>
                <el-table-column
                  label="学历"
                  prop="education">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="pushteacher(scope.row.onlyid)">推送</el-button>
                    <el-button
                      size="small"
                      type="success"
                      @click="unpushteacher(scope.row.onlyid)">撤回</el-button>
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
    Clicktab(e) {
      this.activeName = e.name;
      console.log(this.teatableData);
      if (e.name == "all") {
        this.showteatableData = this.teatableData;
      } else if (e.name == "nopushed") {
        this.showteatableData = this.teatableData.filter(
          item => item.pushed == 0
        );
      } else if (e.name == "pushed") {
        this.showteatableData = this.teatableData.filter(
          item => item.pushed == 1
        );
      }
    },
    async initData() {
      this.getTeachers();
    },
    // handleSizeChange(val) {
    //     console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //     this.currentPage = val;
    //     this.offset = (val - 1)*this.limit;
    //     this.getFoods()
    // },
    async pushteacher(inputonlyid) {
      console.log(inputonlyid);
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/pushreview`,
        {
          onlyid: inputonlyid
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
    async unpushteacher(inputonlyid) {
      console.log(inputonlyid);
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/unpushreview`,
        {
          onlyid: inputonlyid
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
        `${this.$store.state.apiurl}/api/getallreviews`,
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
        this.teatableData.forEach((item, index) => {
          if (this.teatableData[index].pushed == 0)
            this.teatableData[index].pushedtext = "未推送";
          else if (this.teatableData[index].pushed == 1)
            this.teatableData[index].pushedtext = "已推送";
          else this.teatableData[index].pushedtext = "未填写";
          if (this.teatableData[index].reviewed == 0)
            this.teatableData[index].reviewedtext = "未提交";
          else if (this.teatableData[index].reviewed == 1)
            this.teatableData[index].reviewedtext = "未审核";
          else if (this.teatableData[index].reviewed == 2)
            this.teatableData[index].reviewedtext = "已通过";
          else if (this.teatableData[index].reviewed == 3)
            this.teatableData[index].reviewedtext = "未通过";
          else this.teatableData[index].reviewedtext = "出错";
        });
        this.teatableData = this.teatableData.filter(
          item => item.reviewed === 2
        );
        this.showteatableData = this.teatableData;
      }
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
</style>
