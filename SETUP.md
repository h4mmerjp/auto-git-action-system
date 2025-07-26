# 自動開発パイプライン セットアップガイド

このガイドでは、Claude Code エージェントを使用した GitHub Actions 自動開発パイプラインの設定方法を説明します。

## 📋 前提条件

### 必要なもの

- GitHub リポジトリ（管理者権限）
- Claude Code CLI のアクセス権限
- GitHub Actions の実行権限

### リポジトリ構造

```
your-project/
├── .github/workflows/          # GitHub Actions ワークフロー
├── .claude/agents/            # Claude Code エージェント定義
├── .auto-dev/                 # 自動生成データ・メトリクス
├── agents/                    # エージェント定義ファイル
├── docs/                      # ドキュメント・要件定義
└── src/                       # 生成されるソースコード
```

## 🚀 セットアップ手順

### Step 1: エージェントファイルの配置

```bash
# エージェントファイルをダウンロード
git clone https://github.com/your-repo/claude-code-agents.git
cd your-project

# エージェントをコピー
mkdir -p .claude/agents
cp claude-code-agents/agents/*.md .claude/agents/

# または、グローバルに設置
mkdir -p ~/.claude/agents
cp claude-code-agents/agents/*.md ~/.claude/agents/
```

### Step 2: ワークフローファイルの配置

以下のワークフローファイルを `.github/workflows/` ディレクトリに配置：

1. `auto-development.yml` - メイン開発パイプライン
2. `error-handling.yml` - エラー処理・自動修正
3. `monitoring.yml` - 監視・メトリクス収集

### Step 3: 必要なシークレットの設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：

```bash
# Claude Code OAuth Token関連（必要に応じて）
CLAUDE_CODE_OAUTH_TOKEN=your_claude_code_oauth_token

# GitHub Token（通常は自動設定済み）
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

### Step 4: 初期ディレクトリ構造の作成

```bash
mkdir -p {docs,src,tests,.auto-dev/{metadata,metrics,reports,errors,analytics}}

# 初期要件定義ファイルを作成
echo "# Product Requirements Document

## Project Overview
[プロジェクトの概要を記述]

## Goals
[ビジネス目標とユーザー目標を記述]

## Features
[必要な機能を記述]

## Technical Requirements
[技術要件を記述]" > docs/prd.md
```

## 🎯 使用方法

### 新しい自動開発イテレーションの開始

1. **手動実行**:

   - GitHub リポジトリの Actions タブに移動
   - "Auto Development Pipeline" を選択
   - "Run workflow" をクリック
   - 必要なパラメータを入力

2. **自動実行**:
   - `docs/prd.md` ファイルを更新
   - コミット・プッシュで自動的にパイプラインが開始

### パラメータ設定例

```yaml
prd_file: "docs/prd.md"
max_iterations: "10"
project_name: "my-awesome-app"
```

## 📊 監視とメトリクス

### ダッシュボードの確認

自動生成されるダッシュボードで進捗を確認：

- `.auto-dev/dashboard.md` - リアルタイム状況
- `.auto-dev/reports/` - 定期レポート
- `.auto-dev/metrics/` - 生データ

### 主要メトリクス

- **成功率**: イテレーションの成功率
- **エージェント使用頻度**: 各エージェントの活用状況
- **エラーパターン**: よく発生するエラーの種類
- **リソース使用量**: GitHub Actions 分数・ストレージ

## 🔧 カスタマイズ

### エージェントのカスタマイズ

既存エージェントの修正または新規エージェント作成：

```markdown
---
name: my-custom-agent
description: カスタムエージェントの説明
tools: Edit, Write, Read
color: purple
---

カスタムエージェントの指示内容をここに記述...
```

### ワークフローのカスタマイズ

プロジェクトに応じてワークフローを調整：

```yaml
# 実行頻度の調整
on:
  schedule:
    - cron: "0 9 * * 1-5" # 平日9時に実行

# タイムアウト設定
jobs:
  development_phase:
    timeout-minutes: 60 # 60分でタイムアウト
```

### 品質基準の設定

```yaml
# テスト合格基準
- name: Quality Gate
  run: |
    if [ $TEST_COVERAGE -lt 80 ]; then
      echo "Test coverage below 80%"
      exit 1
    fi
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. エージェントが見つからない

```bash
# エージェントファイルの確認
ls -la .claude/agents/
ls -la ~/.claude/agents/

# パーミッション確認
chmod +r .claude/agents/*.md
```

#### 2. Claude Code CLI が動作しない

```bash
# インストール確認
which claude-code
claude-code --version

# パス設定
export PATH=$PATH:~/.local/bin
```

#### 3. ワークフローが失敗する

```bash
# ログの確認
# GitHub Actions の詳細ログを確認
# .auto-dev/errors/ ディレクトリのエラーファイルを確認
```

#### 4. 権限エラー

```bash
# GitHub Token の権限確認
# Actions 権限が有効か確認
# Repository の Admin 権限があるか確認
```

### デバッグモード

デバッグ情報を有効にする：

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📚 高度な設定

### 並列実行の最適化

```yaml
strategy:
  matrix:
    component: [backend, frontend, mobile]
  max-parallel: 3
```

### 条件付き実行

```yaml
if: |
  github.event_name == 'push' || 
  github.event_name == 'workflow_dispatch' ||
  contains(github.event.head_commit.message, '[auto-dev]')
```

### 外部システム連携

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔄 継続的改善

### A/B テストの実施

```yaml
- name: A/B Test Agent Configuration
  run: |
    if [ $((RANDOM % 2)) -eq 0 ]; then
      export AGENT_CONFIG="conservative"
    else
      export AGENT_CONFIG="aggressive"  
    fi
```

### フィードバックループの実装

```yaml
- name: Collect User Feedback
  run: |
    # ユーザーフィードバックの収集
    # メトリクスの分析
    # エージェント設定の最適化
```

## 📖 参考資料

### ドキュメント

- [Claude Code 公式ドキュメント](https://docs.anthropic.com/claude-code)
- [GitHub Actions ドキュメント](https://docs.github.com/actions)
- [YAML 設定リファレンス](https://yaml.org/spec/)

### コミュニティ

- [Claude Code コミュニティ](https://community.anthropic.com)
- [GitHub Actions コミュニティ](https://github.community)

### サポート

- 問題報告: GitHub Issues
- 機能要望: Discussions
- セキュリティ問題: Security Advisories

---

## 📝 設定チェックリスト

セットアップ完了前に以下を確認：

### 基本設定

- [ ] エージェントファイルが配置されている
- [ ] ワークフローファイルが配置されている
- [ ] 必要なディレクトリが作成されている
- [ ] 初期 PRD ファイルが作成されている

### 権限・認証

- [ ] GitHub Actions が有効になっている
- [ ] 必要なシークレットが設定されている
- [ ] リポジトリの権限が適切に設定されている
- [ ] Claude Code へのアクセス権限がある

### 動作確認

- [ ] 手動ワークフロー実行が成功する
- [ ] エージェントが正常に動作する
- [ ] メトリクス収集が機能している
- [ ] エラーハンドリングが動作する

### 監視・運用

- [ ] ダッシュボードが表示される
- [ ] アラート設定が機能している
- [ ] データ保持ポリシーが設定されている
- [ ] バックアップ戦略が決まっている

すべてのチェックが完了したら、自動開発パイプラインの運用を開始できます！
