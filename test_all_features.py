from playwright.sync_api import sync_playwright
import time
import random

class BabyMemoTester:
    def __init__(self):
        self.base_url = 'http://localhost:3000'
        self.test_username = f'testuser_{random.randint(1000, 9999)}'
        self.test_password = 'password123'
        self.test_name = '测试用户'
    
    def test_registration(self, page):
        """测试注册功能"""
        print("\n=== 测试注册功能 ===")
        
        # 访问登录页面
        page.goto(self.base_url)
        page.wait_for_load_state('networkidle')
        
        # 切换到注册模式
        register_button = page.locator('button:has-text("注册")').first
        register_button.click()
        page.wait_for_timeout(1000)
        
        # 填充注册表单
        name_input = page.locator('input[id="name"]')
        username_input = page.locator('input[id="username"]')
        password_input = page.locator('input[id="password"]')
        
        name_input.fill(self.test_name)
        username_input.fill(self.test_username)
        password_input.fill(self.test_password)
        
        # 点击注册按钮
        submit_button = page.locator('button:has-text("注册")').nth(1)
        submit_button.click()
        page.wait_for_timeout(2000)
        
        # 检查是否注册成功（应该跳转到仪表盘）
        current_url = page.url
        if '/dashboard' in current_url:
            print("✅ 注册成功，已跳转到仪表盘")
            return True
        else:
            print("❌ 注册失败，未跳转到仪表盘")
            return False
    
    def test_login(self, page):
        """测试登录功能"""
        print("\n=== 测试登录功能 ===")
        
        # 访问登录页面
        page.goto(self.base_url)
        page.wait_for_load_state('networkidle')
        
        # 填充登录表单
        username_input = page.locator('input[id="username"]')
        password_input = page.locator('input[id="password"]')
        
        username_input.fill(self.test_username)
        password_input.fill(self.test_password)
        
        # 点击登录按钮
        submit_button = page.locator('button:has-text("登录")').nth(1)
        submit_button.click()
        page.wait_for_timeout(2000)
        
        # 检查是否登录成功
        current_url = page.url
        if '/dashboard' in current_url:
            print("✅ 登录成功，已跳转到仪表盘")
            return True
        else:
            print("❌ 登录失败，未跳转到仪表盘")
            return False
    
    def test_dashboard(self, page):
        """测试仪表盘功能"""
        print("\n=== 测试仪表盘功能 ===")
        
        # 确保在仪表盘页面
        if '/dashboard' not in page.url:
            page.goto(f'{self.base_url}/dashboard')
            page.wait_for_load_state('networkidle')
        
        # 检查仪表盘元素
        try:
            # 检查欢迎信息
            welcome_text = page.locator('h1').first.text_content()
            print(f"✅ 仪表盘欢迎信息: {welcome_text}")
            
            # 检查快速访问卡片
            quick_access_cards = page.locator('.card').all()
            print(f"✅ 快速访问卡片数量: {len(quick_access_cards)}")
            
            # 检查导航菜单
            nav_links = page.locator('nav a').all()
            print(f"✅ 导航链接数量: {len(nav_links)}")
            
            return True
        except Exception as e:
            print(f"❌ 仪表盘测试失败: {e}")
            return False
    
    def test_babies(self, page):
        """测试宝宝管理功能"""
        print("\n=== 测试宝宝管理功能 ===")
        
        # 导航到宝宝页面
        page.goto(f'{self.base_url}/babies')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 宝宝页面标题: {page_title}")
            
            # 检查添加宝宝按钮
            add_button = page.locator('button:has-text("添加宝宝")')
            if add_button.is_visible():
                print("✅ 添加宝宝按钮存在")
            
            return True
        except Exception as e:
            print(f"❌ 宝宝页面测试失败: {e}")
            return False
    
    def test_photos(self, page):
        """测试照片管理功能"""
        print("\n=== 测试照片管理功能 ===")
        
        # 导航到照片页面
        page.goto(f'{self.base_url}/photos')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 照片页面标题: {page_title}")
            
            # 检查上传照片按钮
            upload_button = page.locator('button:has-text("上传照片")')
            if upload_button.is_visible():
                print("✅ 上传照片按钮存在")
            
            return True
        except Exception as e:
            print(f"❌ 照片页面测试失败: {e}")
            return False
    
    def test_diaries(self, page):
        """测试日记管理功能"""
        print("\n=== 测试日记管理功能 ===")
        
        # 导航到日记页面
        page.goto(f'{self.base_url}/diaries')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 日记页面标题: {page_title}")
            
            # 检查添加日记按钮
            add_button = page.locator('button:has-text("添加日记")')
            if add_button.is_visible():
                print("✅ 添加日记按钮存在")
            
            return True
        except Exception as e:
            print(f"❌ 日记页面测试失败: {e}")
            return False
    
    def test_calendar(self, page):
        """测试日历功能"""
        print("\n=== 测试日历功能 ===")
        
        # 导航到日历页面
        page.goto(f'{self.base_url}/calendar')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 日历页面标题: {page_title}")
            
            # 检查日历控件
            calendar_element = page.locator('.calendar')
            if calendar_element.is_visible():
                print("✅ 日历控件存在")
            
            return True
        except Exception as e:
            print(f"❌ 日历页面测试失败: {e}")
            return False
    
    def test_timeline(self, page):
        """测试时间线功能"""
        print("\n=== 测试时间线功能 ===")
        
        # 导航到时间线页面
        page.goto(f'{self.base_url}/timeline')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 时间线页面标题: {page_title}")
            
            # 检查时间线元素
            timeline_element = page.locator('.timeline')
            if timeline_element.is_visible():
                print("✅ 时间线元素存在")
            
            return True
        except Exception as e:
            print(f"❌ 时间线页面测试失败: {e}")
            return False
    
    def test_growth(self, page):
        """测试成长记录功能"""
        print("\n=== 测试成长记录功能 ===")
        
        # 导航到成长记录页面
        page.goto(f'{self.base_url}/growth')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 成长记录页面标题: {page_title}")
            
            # 检查添加记录按钮
            add_button = page.locator('button:has-text("添加记录")')
            if add_button.is_visible():
                print("✅ 添加记录按钮存在")
            
            return True
        except Exception as e:
            print(f"❌ 成长记录页面测试失败: {e}")
            return False
    
    def test_videos(self, page):
        """测试视频管理功能"""
        print("\n=== 测试视频管理功能 ===")
        
        # 导航到视频页面
        page.goto(f'{self.base_url}/videos')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 视频页面标题: {page_title}")
            
            # 检查上传视频按钮
            upload_button = page.locator('button:has-text("上传视频")')
            if upload_button.is_visible():
                print("✅ 上传视频按钮存在")
            
            return True
        except Exception as e:
            print(f"❌ 视频页面测试失败: {e}")
            return False
    
    def test_settings(self, page):
        """测试设置功能"""
        print("\n=== 测试设置功能 ===")
        
        # 导航到设置页面
        page.goto(f'{self.base_url}/settings')
        page.wait_for_load_state('networkidle')
        
        # 检查页面元素
        try:
            page_title = page.locator('h1').first.text_content()
            print(f"✅ 设置页面标题: {page_title}")
            
            # 检查设置选项
            settings_options = page.locator('div.setting-option').all()
            print(f"✅ 设置选项数量: {len(settings_options)}")
            
            return True
        except Exception as e:
            print(f"❌ 设置页面测试失败: {e}")
            return False
    
    def test_logout(self, page):
        """测试登出功能"""
        print("\n=== 测试登出功能 ===")
        
        # 确保在仪表盘页面
        if '/dashboard' not in page.url:
            page.goto(f'{self.base_url}/dashboard')
            page.wait_for_load_state('networkidle')
        
        # 点击登出按钮
        try:
            logout_button = page.locator('button:has-text("登出")')
            if logout_button.is_visible():
                logout_button.click()
                page.wait_for_timeout(1000)
                
                # 检查是否跳转到登录页面
                current_url = page.url
                if current_url == self.base_url:
                    print("✅ 登出成功，已跳转到登录页面")
                    return True
                else:
                    print("❌ 登出失败，未跳转到登录页面")
                    return False
            else:
                print("❌ 未找到登出按钮")
                return False
        except Exception as e:
            print(f"❌ 登出测试失败: {e}")
            return False
    
    def run_all_tests(self):
        """运行所有测试"""
        print(f"开始测试 BabyMemo 系统，测试用户: {self.test_username}")
        
        test_results = {
            'registration': False,
            'login': False,
            'dashboard': False,
            'babies': False,
            'photos': False,
            'diaries': False,
            'calendar': False,
            'timeline': False,
            'growth': False,
            'videos': False,
            'settings': False,
            'logout': False
        }
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()
            
            try:
                # 运行测试
                test_results['registration'] = self.test_registration(page)
                
                if test_results['registration']:
                    test_results['dashboard'] = self.test_dashboard(page)
                    test_results['babies'] = self.test_babies(page)
                    test_results['photos'] = self.test_photos(page)
                    test_results['diaries'] = self.test_diaries(page)
                    test_results['calendar'] = self.test_calendar(page)
                    test_results['timeline'] = self.test_timeline(page)
                    test_results['growth'] = self.test_growth(page)
                    test_results['videos'] = self.test_videos(page)
                    test_results['settings'] = self.test_settings(page)
                    test_results['logout'] = self.test_logout(page)
                    
                    # 测试登录功能
                    test_results['login'] = self.test_login(page)
                
            finally:
                browser.close()
        
        # 打印测试结果
        print("\n=== 测试结果汇总 ===")
        total_tests = len(test_results)
        passed_tests = sum(1 for result in test_results.values() if result)
        
        for test_name, result in test_results.items():
            status = "✅ 通过" if result else "❌ 失败"
            print(f"{test_name}: {status}")
        
        print(f"\n测试完成: {passed_tests}/{total_tests} 个测试通过")
        
        return test_results

if __name__ == "__main__":
    tester = BabyMemoTester()
    tester.run_all_tests()
