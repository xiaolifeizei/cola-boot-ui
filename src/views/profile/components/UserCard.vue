<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="'/userAvatar.jpg'" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="el-icon-lock" /><span>登陆名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.loginName }}
          </div>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="el-icon-mobile-phone" /><span>手机号</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.phone ? user.userInfo.phone : '未添加' }}
          </div>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="el-icon-s-check" /><span>身份证号</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.ids ? user.userInfo.ids : '未添加' }}
          </div>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="guide" /><span>注册时间</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userInfo.createTime }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: '',
          userInfo: {
            ids: '',
            phone: '',
            loginName: '',
            createTime: ''
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
