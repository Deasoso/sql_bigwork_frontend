<template>
    <div>
        <head-top></head-top>
		<el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
		<el-button type="primary" @click="getAllValue">获取总数据</el-button>
		<section class="data_section">
			<header class="section_title">数据统计</header>
			<!-- <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{adminCount}}</span> 新增管理员</div></el-col>
			</el-row> -->
            <el-row :gutter="20">
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{allvalue}}</span> 总收入</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{((allvalue * 80) - nowithdraw) * 0.01}}</span> 教师提现</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{(allvalue * 20 + nowithdraw) * 0.01}}</span> 余额</div></el-col>
            </el-row>
		</section>
    </div>
</template>

<script>
const axios = require("axios");
import headTop from '../components/headTop'

export default {
  data() {
    return {
      headertoken: "",
      allvalue: 0,
      nowithdraw: 0
    };
  },
  components: {
    headTop,
    tendency
  },
  mounted() {

  },
  computed: {},
  methods: {
    async getAllValue() {
      this.tableData = [];
      const response = await axios.get(
        `https://api.deaso40.com/api/getallvalue`,
        {
          data: {},
          headers: {
            token: this.headertoken
          }
        }
      );
      console.log(response);
      const data = response.data;
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.allvalue = data.result.allvalue;
        this.nowithdraw = data.result.nowithdraw;
      }
    },
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
</style>
