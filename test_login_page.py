from playwright.sync_api import sync_playwright
import time

# 测试 BabyMemo 登录页面
def test_login_page():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)  # 非无头模式，方便查看
        page = browser.new_page()
        
        # 访问登录页面
        print("访问登录页面...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # 截图保存
        page.screenshot(path='/workspace/babymemo/login_page.png', full_page=True)
        print("登录页面截图已保存")
        
        # 检查页面元素
        print("\n检查页面元素...")
        
        # 检查标题
        title = page.title()
        print(f"页面标题: {title}")
        
        # 检查 BabyMemo 标题
        header = page.locator('h1').first
        if header.is_visible():
            print(f"页面标题: {header.text_content()}")
        else:
            print("未找到页面标题")
        
        # 检查登录/注册按钮
        login_button = page.locator('button:has-text("登录")').first
        register_button = page.locator('button:has-text("注册")').first
        
        if login_button.is_visible():
            print("登录按钮存在")
        if register_button.is_visible():
            print("注册按钮存在")
        
        # 检查用户名和密码输入框
        username_input = page.locator('input[id="username"]')
        password_input = page.locator('input[id="password"]')
        
        if username_input.is_visible():
            print("用户名输入框存在")
        if password_input.is_visible():
            print("密码输入框存在")
        
        # 测试登录/注册切换
        print("\n测试登录/注册切换...")
        
        # 点击注册按钮
        register_button.click()
        page.wait_for_timeout(1000)  # 等待页面变化
        
        # 检查姓名输入框是否出现
        name_input = page.locator('input[id="name"]')
        if name_input.is_visible():
            print("注册模式: 姓名输入框存在")
        else:
            print("注册模式: 未找到姓名输入框")
        
        # 点击登录按钮切换回登录模式
        login_button.click()
        page.wait_for_timeout(1000)  # 等待页面变化
        
        if not name_input.is_visible():
            print("登录模式: 姓名输入框已隐藏")
        else:
            print("登录模式: 姓名输入框仍可见")
        
        # 测试表单填充
        print("\n测试表单填充...")
        
        # 填充登录表单
        username_input.fill('testuser')
        password_input.fill('password123')
        
        # 检查填充是否成功
        filled_username = username_input.input_value()
        filled_password = password_input.input_value()
        
        print(f"填充的用户名: {filled_username}")
        print(f"填充的密码: {'*' * len(filled_password)}")
        
        # 测试提交按钮
        submit_button = page.locator('button:has-text("登录")').nth(1)
        if submit_button.is_visible():
            print("提交按钮存在")
        
        # 截图保存填写后的状态
        page.screenshot(path='/workspace/babymemo/login_page_filled.png', full_page=True)
        print("填写后的页面截图已保存")
        
        # 关闭浏览器
        browser.close()
        print("\n测试完成！")

if __name__ == "__main__":
    test_login_page()
